const toolsLandingPageData = [
  {
    type: 'TiDB Operator',
    iconName: 'tidb-operator',
    desc:
      'TiDB Operator 是 Kubernetes 上的 TiDB 集群自动运维系统，提供包括部署、升级、扩缩容、备份恢复、配置变更的 TiDB 全生命周期管理。借助 TiDB Operator，TiDB 可以无缝运行在公有云或私有部署的 Kubernetes 集群上。',
    link: '/zh/tidb-in-kubernetes/v1.1',
  },
  {
    type: 'TiDB Data Migration',
    iconName: 'dm',
    desc:
      'TiDB Data Migration (DM) 是一体化的数据同步任务管理平台，支持从 MySQL 或 MariaDB 到 TiDB 的全量数据迁移和增量数据同步。使用 DM 工具有利于简化错误处理流程，降低运维成本。',
    link: '/zh/tidb-data-migration/v1.0',
  },
  {
    type: 'Database Tools',
    iconName: 'tidb-tools',
    desc:
      'TiDB 数据库工具是用于处理 TiDB 导入导出数据的命令行实用程序的集合。包括：Mydumper、Loader、Syncer、sync-diff-inspector。',
    link: '/zh/tidb/dev/ecosystem-tool-user-guide',
  },
  {
    type: 'TiUP',
    iconName: 'tiup',
    desc:
      'TiUP 承担着包管理器的角色，管理着 TiDB 生态下众多的组件，如 TiDB、PD、TiKV 等。用户想要运行 TiDB 生态中任何组件时，只需要执行 TiUP 一行命令即可，相比以前，极大地降低了管理难度。',
    link: '/zh/tidb/dev/tiup-documentation-guide',
  },
]

export { toolsLandingPageData }
