# Parallel Build Sharding Design

## 背景

当前生产构建流程是一次 `pnpm build` 生成完整 `public/`，随后直接将整份产物同步到 COS。

现状有两个直接限制：

1. GitHub Actions 只有单个构建任务，无法利用多机并行。
2. 部署步骤对整个站点执行 `coscli sync --delete`，天然假设 `public/` 是完整站点，不能安全支持多个分片并行上传。

目标是在保持同一份代码和同一套发布入口的前提下，将构建拆成多个并行 shard，分别产出各自负责的站点子集，再在单独的汇总阶段合并产物并统一上传。

## 目标

1. 同一份代码支持按 shard 构建。
2. shard 至少支持按语言拆分。
3. 每个 shard 单独产出可归档 artifact。
4. 只在汇总后的单点部署阶段执行 `sync --delete`。
5. 不改变线上 URL 结构。
6. 保持现有 archive 流程与 production 流程可并存。

## 非目标

1. 本设计不引入多 bucket 或多域名部署。
2. 本设计不尝试让多个 shard 直接并行上传到同一 COS 前缀。
3. 本设计不要求第一阶段就按 repo、版本进一步细分 shard。
4. 本设计不调整文档站的 URL mapping 规则。

## 现状分析

### Workflow 现状

生产流在 `.github/workflows/production.yml` 中执行单次 `pnpm build`，随后：

1. 同步 `public/` 中的非 markdown/txt 文件到 COS。
2. 再同步 `public/` 中的 markdown/txt 文件到 COS。

两个同步步骤都面向完整 `public/` 目录，其中第一个步骤带 `--delete`。这意味着如果多个任务各自只上传部分站点内容，后执行的任务会删除其他任务已经上传的文件。

### Gatsby 现状

当前构建逻辑默认读取所有语言和所有 markdown 内容：

1. `gatsby-plugin-react-i18next` 固定配置 `en/zh/ja`。
2. `gatsby-source-filesystem` 在生产态不会按语言过滤 `docs/markdown-pages`。
3. `createDocs()` 会基于当前查询到的全部 MDX 节点创建页面。
4. `cpMarkdown()` 会在创建页面时，把对应 markdown 复制到 `public`。

这意味着如果要支持 shard，至少要同时控制以下三件事：

1. source 阶段只读取 shard 需要的 markdown。
2. page creation 阶段只创建 shard 负责的页面。
3. markdown copy 阶段只输出 shard 负责的 `.md/.txt` 文件。

### 语言分片的特殊性

虽然需求可以表述为“按语言拆分”，但本仓库的 URL 并不完全对称：

1. `en` 是默认语言，没有 `/en/` 前缀。
2. `zh` 和 `ja` 有各自的路径前缀。
3. 首页 `/`、搜索页 `/search/`、Cloud API `/tidbcloud/api/*` 等页面更接近全站共享页，实际上更适合归入 `en` 所在 shard。

因此第一阶段建议采用逻辑 shard，而不是机械地做成三个完全对称的语言 shard。

## 设计结论

采用三段式架构：

1. `matrix build` 并行构建 shard
2. `merge artifacts` 汇总并校验产物
3. `single deploy` 单点上传和 CDN 刷新

第一阶段的 shard 划分建议如下：

1. `core-en`
2. `zh`
3. `ja`

其中：

### `core-en` 负责

1. 根路径英文内容
2. 所有无语言前缀的英文页面
3. 首页 `/`
4. 搜索页 `/search/`
5. Cloud API 页面
6. Gatsby 运行时共享文件
7. 全站静态资源

### `zh` 负责

1. `/zh/**`
2. `/zh/**/*.md`
3. `/page-data/zh/**`
4. 其他仅由 zh 页面生成的 page-data 文件

### `ja` 负责

1. `/ja/**`
2. `/ja/**/*.md`
3. `/page-data/ja/**`
4. 其他仅由 ja 页面生成的 page-data 文件

## 总体方案

### 方案原则

1. shard 只对“构建输入”和“页面生成范围”做裁剪。
2. 线上 bucket 永远只接受一份合并后的完整站点产物。
3. shard 构建结果先作为 GitHub artifact 保存。
4. merge job 在工作目录内合并所有 artifact，并在冲突时失败。

### 核心环境变量

引入以下环境变量：

1. `WEBSITE_BUILD_SHARD`
   可选值：`core-en`、`zh`、`ja`、`all`
2. `WEBSITE_BUILD_LOCALES`
   逗号分隔：例如 `en`、`zh`、`ja`、`en,zh,ja`
3. `WEBSITE_BUILD_SHARED_PAGES`
   布尔值，仅 `core-en` 为 `true`
4. `WEBSITE_BUILD_OUTPUT_DIR`
   默认为 `public`，可选支持未来输出到 `public-shards/<name>`

第一阶段只要求真正使用前 3 个变量。

## 代码改造设计

### 1. 增加 shard 配置工具

新增文件建议：

1. `gatsby/build-shard.ts`

职责：

1. 解析环境变量。
2. 提供当前 shard 的 locale 集合。
3. 判断共享页面是否属于当前 shard。
4. 暴露统一工具函数，避免在多个文件中重复写 `process.env` 逻辑。

建议导出：

1. `getBuildShard(): "all" | "core-en" | "zh" | "ja"`
2. `getBuildLocales(): Locale[]`
3. `shouldBuildLocale(locale: Locale): boolean`
4. `shouldBuildSharedPages(): boolean`
5. `isShardEnabled(): boolean`

### 2. 在 source 阶段过滤 markdown 输入

修改 `gatsby-config.js` 中 `markdown-pages` 的 source 配置。

当前问题：

1. 生产态总是读取整个 `docs/markdown-pages`。
2. 即使后续只创建部分页面，GraphQL 仍然要索引全部 MDX，构建收益有限。

目标：

1. `core-en` 只读取 `docs/markdown-pages/en/**`
2. `zh` 只读取 `docs/markdown-pages/zh/**`
3. `ja` 只读取 `docs/markdown-pages/ja/**`
4. `all` 维持现状

实现方式：

1. 在 `gatsby-config.js` 里根据 `WEBSITE_BUILD_LOCALES` 动态生成 `ignore`。
2. 仅忽略不属于当前 shard 的语言目录。

注意：

1. `locale/` 目录中的 i18n translation json 不应裁剪。
2. `gatsby-plugin-react-i18next` 的 `languages` 建议仍保留完整 `en/zh/ja`，避免运行时语言切换或 page context 假设变化过大。

是否要裁剪 `gatsby-plugin-react-i18next.languages`：

1. 第一阶段不建议裁剪。
2. 只裁剪 markdown source 和 createPage 范围即可。
3. 这样运行时 i18n 插件配置更稳定，改动面更小。

### 3. 在 createPages 阶段按 shard 过滤

修改 `gatsby-node.js` 和 `gatsby/create-pages/*`。

#### `createDocs`

在 `gatsby/create-pages/create-docs.ts` 中：

1. 对 `docs.data!.allMdx.nodes` 先按 locale 过滤，再进入 `filterNodesByToc()`。
2. `cpMarkdown()` 仅对当前 shard 节点执行。
3. `createRedirect()` 仅为当前 shard 页面创建。

建议新增步骤：

1. 将 `allMdx.nodes` 映射成包含 `pathConfig` 的节点。
2. 用 `shouldBuildLocale(pathConfig.locale)` 过滤。
3. 再执行 TOC filter。

#### `createDocHome`

首页 `_docHome` 不能简单按 locale 过滤，因为首页路径本身是 `/`。

规则建议：

1. `core-en` 创建 `/`
2. `zh` 不创建 `/`
3. `ja` 不创建 `/`
4. 若未来存在 `/zh/`、`/ja/` 的首页内容，是否需要独立构建对应 page-data，要按当前实际输出验证

保守做法：

1. 首页相关逻辑全部归 `core-en`
2. `zh` 和 `ja` shard 不创建 `createDocHome()`

#### `createDocSearch`

规则建议：

1. `/search/` 归 `core-en`
2. 其他 shard 不创建 search page

#### `createCloudAPIReference`

规则建议：

1. Cloud API 仅归 `core-en`
2. 其他 shard 不创建

#### `create404`

规则建议：

1. 404 页只由 `core-en` 创建

原因：

1. `404.html` 是站点级共享资源。
2. 由多个 shard 重复构建没有收益，且容易引入覆盖差异。

### 4. 修正 `availIn` 的计算

这是本次设计里最关键的代码点之一。

当前 `availIn.locale` 和 `availIn.version` 是从当前构建出的 `nodes` 计算的。如果 shard 只包含一种语言，页面会误判为只支持当前语言。

必须改造为两阶段数据源：

1. `page creation set`
   当前 shard 实际要创建的页面集合
2. `availability set`
   用于计算 `availIn` 的全量文档元数据集合

设计方案：

1. GraphQL 仍查询全部 MDX 元数据，用于 availability 计算。
2. 仅在构建页面前对 `page creation set` 做 shard 过滤。

为了避免重新解析全部页面内容，可接受的折中是：

1. source 仍然按 shard 过滤 markdown 文件。
2. 另外通过文件系统直接扫描 `docs/markdown-pages/**`，构建轻量 metadata index，用于 `availIn`。

推荐实现：

1. 新增 `gatsby/doc-metadata.ts`
2. 直接遍历 `docs/markdown-pages` 文件路径
3. 只解析 slug、locale、repo、branch、name，不读取正文
4. 用该全量 metadata 计算 `versionRecord`

原因：

1. GraphQL 在 source 已裁剪后，无法再提供全量 availability 信息。
2. 直接扫描路径开销小，逻辑确定。

### 5. Markdown 原文复制策略

`cpMarkdown()` 本身不需要复杂改动，但需要满足两个条件：

1. 只在当前 shard 的页面集上调用。
2. 输出路径必须和最终线上路径一致。

第一阶段不建议把 markdown 输出到独立目录树再二次搬运，因为：

1. 当前逻辑已经按最终 URL 复制到 `public/*.md`
2. merge job 直接目录合并更简单

### 6. 共享文件归属规则

为避免合并时出现不确定覆盖，定义明确归属：

由 `core-en` 独占输出：

1. `404.html` 相关文件
2. 根路径页面
3. `/search/`
4. `/tidbcloud/api/**`
5. `static/**`
6. `~partytown/**`
7. `favicon.ico`
8. 根目录 `llms.txt`
9. 其他根级共享文件
10. Gatsby runtime 共享文件

由语言 shard 独占输出：

1. `/zh/**`
2. `/ja/**`
3. 与对应语言页面一一对应的 `.md`
4. 与对应语言页面对应的 `page-data`

### 7. 产物冲突规则

merge job 合并 artifact 时执行冲突检查。

规则：

1. 如果某个文件路径只出现在一个 shard，直接拷贝。
2. 如果某个文件路径在多个 shard 中出现，默认失败。
3. 可选白名单只允许极少数明确相同内容的共享文件重复出现。

第一阶段建议不做内容级去重白名单，简单直接：

1. `core-en` 负责共享文件
2. `zh/ja` 不应生成共享文件
3. 一旦重复，说明分片边界没切干净，应直接失败

## Workflow 设计

### 新的 production 流程结构

建议将现有 `production.yml` 拆成三个 job：

1. `build-shards`
2. `merge-public`
3. `deploy`

再保留：

4. `cdn-refresh`

### `build-shards` job

使用 matrix：

1. `core-en`
2. `zh`
3. `ja`

每个 matrix 项执行：

1. checkout
2. setup node
3. submodule update
4. install deps
5. restore shard-specific cache
6. set shard env
7. run `pnpm build`
8. upload artifact，例如 `public-core-en`, `public-zh`, `public-ja`

建议增加输出目录重命名：

1. build 完成后把 `public/` 移动到 `artifact/<shard>/`
2. 上传该目录为 artifact

### `merge-public` job

依赖 `build-shards` 全部成功。

步骤：

1. 下载所有 shard artifact
2. 将 `core-en` 产物作为初始目录
3. 依次合并 `zh`、`ja`
4. 执行冲突检查
5. 输出合并后的 `public/`
6. 上传一个最终合并 artifact，供部署和问题排查使用

建议增加一个简单脚本：

1. `scripts/merge-public-artifacts.mjs`

职责：

1. 输入多个目录
2. 扫描重复文件
3. 非冲突文件拷贝到目标目录
4. 冲突时打印文件列表并退出 1

### `deploy` job

只下载合并后的 `public/` artifact，并执行一次部署。

部署逻辑保持现有行为：

1. 非 markdown/txt 同步到 COS，带 `--delete`
2. markdown/txt 单独同步

这样可以保留现有线上行为和 MIME 设置，不改变运维模型。

### `cdn-refresh` job

保持依赖 `deploy`。

## 缓存设计

当前 cache key 仅包含 docs submodule sha，不包含 shard。

改造后必须加 shard 维度：

1. `gatsby-cache-docs-staging-${submodule_sha}-${shard}`

原因：

1. `.cache/` 和 `public/` 不再代表完整站点。
2. 不同 shard 共用 cache 会发生脏读和错误复用。

是否继续缓存 `public/`：

1. 第一阶段可以保留，与当前行为一致。
2. 但从收益和稳定性上看，后续更建议只缓存 `.cache`

保守建议：

1. 第一阶段最小改动，继续缓存 `.cache` 和 `public`
2. key 增加 shard

## 目录与文件建议

建议新增：

1. `gatsby/build-shard.ts`
2. `gatsby/doc-metadata.ts`
3. `scripts/merge-public-artifacts.mjs`

建议修改：

1. `.github/workflows/production.yml`
2. `gatsby-config.js`
3. `gatsby-node.js`
4. `gatsby/create-pages/create-docs.ts`
5. `gatsby/create-pages/create-doc-home.ts`
6. `gatsby/create-pages/create-search.ts`
7. `gatsby/create-pages/create-cloud-api.ts`
8. `gatsby/create-pages/create-404.ts`

## 分阶段实施计划

### Phase 1: 代码侧支持 shard build

交付物：

1. 本地可以通过环境变量构建单 shard
2. `core-en`、`zh`、`ja` 可分别成功 `gatsby build`
3. `availIn` 不因分片而错误

验证：

1. 本地分别运行三次 shard build
2. 检查 `public/` 内容边界是否符合预期

### Phase 2: Workflow matrix + artifact merge

交付物：

1. GitHub Actions 产出三个 shard artifact
2. merge job 能得到完整 `public/`
3. 冲突检测可用

验证：

1. 在 workflow_dispatch 上先跑不部署模式
2. 对比合并后的目录和旧全量 build 的差异

### Phase 3: 切换生产部署

交付物：

1. deploy job 改为消费 merge artifact
2. CDN refresh 维持原流程

验证：

1. 先在 backup bucket 或临时前缀验证
2. 产物对比稳定后切主流程

## 验证方案

### 构建正确性

执行以下对比：

1. 单次全量 build 的 `public/`
2. 三个 shard build 合并后的 `public/`

检查项目：

1. 文件总数
2. HTML 文件总数
3. `.md/.txt` 文件总数
4. `page-data` 文件总数
5. 关键路径文件是否存在
6. 关键共享文件是否只来自 `core-en`

建议编写简单 diff 脚本，重点比对：

1. 路径集合一致性
2. 文件大小差异
3. 对少量关键 JSON 做结构 diff

### 路由验证

至少覆盖：

1. `/`
2. `/search/`
3. `/tidb/stable/`
4. `/zh/tidb/stable/`
5. `/ja/tidb/stable/`
6. `/tidbcloud/api/v1beta`
7. `/404/`

### 回归点

重点关注：

1. 语言切换组件的 `availIn`
2. TOC 过滤逻辑
3. markdown 原文下载路径
4. page-data 路径完整性
5. 404/search/home 是否只生成一次

## 风险与应对

### 风险 1: `availIn` 错误

表现：

1. 页面明明存在 `zh/ja` 版本，但 UI 显示只有当前语言

应对：

1. 将 `availIn` 从“当前 shard 节点集”中解耦
2. 使用全量文件系统 metadata 计算

### 风险 2: merge 阶段出现共享文件冲突

表现：

1. 多个 shard 生成相同路径文件

应对：

1. 明确共享页面归 `core-en`
2. merge 脚本默认冲突即失败

### 风险 3: Gatsby runtime 文件名不稳定

表现：

1. 不同 shard 对共享 runtime 文件产出不同 hash

应对：

1. 禁止多个 shard 各自产出共享 runtime 文件
2. 共享 runtime 文件只取 `core-en`

### 风险 4: matrix 拆分后总耗时不降反升

原因：

1. 每个 shard 都要完整执行依赖安装和 Gatsby 启动

应对：

1. 先观察 CPU/内存瓶颈和 wall time
2. 若单 shard 构建足够轻，再考虑进一步细分
3. 如果 merge 成本小于单机全量 build，则整体仍有收益

## 推荐实施顺序

1. 先做代码侧 shard build 能力，不改线上 workflow
2. 在本地或临时 workflow 验证三 shard 合并结果
3. 再改 production workflow 为 matrix + merge + deploy
4. 最后观察 1 到 2 周构建时长和失败率

## 最小可行版本

如果希望先快速验证收益，最小版本可以只做：

1. `core-en/zh/ja` 三个 shard 环境变量
2. `createPages` 按 locale/共享页过滤
3. workflow matrix 构建并上传 artifact
4. merge job 合并并做路径冲突检测

先不做：

1. 更细粒度 repo shard
2. archive workflow 同步改造
3. 复杂的内容级冲突白名单

## 预期收益

1. 利用 GitHub Actions 多机并行，降低整体 wall time
2. 将构建失败定位到具体 shard
3. 为未来按 repo、版本进一步拆分构建提供基础设施
4. 保留现有部署模型，降低上线风险

## 决策摘要

建议采用以下落地策略：

1. 第一阶段按 `core-en`、`zh`、`ja` 三个 shard 拆分。
2. shard 只负责构建，不直接部署到 bucket。
3. 所有 shard artifact 先合并，再统一执行一次部署。
4. 共享文件和共享页面统一归 `core-en`。
5. `availIn` 从 shard 页面集解耦，改为全量 metadata 计算。

这是在当前仓库结构下，改动面、风险和收益相对平衡的实现路径。
