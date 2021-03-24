<p align="center">
  <img src="images/pingcap-icon.png" width="128" alt="PingCAP Logo" />
</p>
<h1 align="center">website-docs</h1>

<p align="center">The next generation of PingCAP Docs. Powered by Gatsby ⚛️.</p>

> Note: Currently WIP

[![Netlify Status](https://api.netlify.com/api/v1/badges/8d59fdbd-2ab5-4f97-b5c5-4c00d932feee/deploy-status)](https://app.netlify.com/sites/pingcap-docs-preview/deploys)
![Update docs when receiving repo dispatch](https://github.com/pingcap/website-docs/workflows/Update%20docs%20when%20receiving%20repo%20dispatch/badge.svg)

## How to develop

After clone this repo, run `yarn` to get all deps:

```sh
yarn
```

We have pre-defined some commands to download the docs and clear docs, these commands are:

```json
{
  "scripts": {
    "clean:docs:docs-tidb:en": "rimraf ./markdown-pages/contents/en/docs-tidb/**/*.md",
    "clean:docs:docs-tidb:zh": "rimraf ./markdown-pages/contents/zh/docs-tidb/**/*.md",
    "clean:docs:docs-tidb-operator:en": "rimraf ./markdown-pages/contents/en/docs-tidb-operator/**/*.md",
    "clean:docs:docs-tidb-operator:zh": "rimraf ./markdown-pages/contents/zh/docs-tidb-operator/**/*.md",
    "clean:docs:docs-dm:en": "rimraf ./markdown-pages/contents/en/docs-dm/**/*.md",
    "clean:docs:docs-dm:zh": "rimraf ./markdown-pages/contents/zh/docs-dm/**/*.md",
    "download:docs-tidb:en": "node markdown-pages/cli.js download docs",
    "download:docs-tidb:en:all": "./scripts/download-docs-tidb-en.sh",
    "download:docs-tidb:zh": "node markdown-pages/cli.js download docs-cn",
    "download:docs-tidb:zh:all": "./scripts/download-docs-tidb-zh.sh",
    "download:docs-tidb-operator": "node markdown-pages/cli.js download docs-tidb-operator",
    "download:docs-tidb-operator:all": "./scripts/download-docs-tidb-operator.sh",
    "download:docs-tidb-operator:en:all": "./scripts/download-docs-tidb-operator-en.sh",
    "download:docs-tidb-operator:zh:all": "./scripts/download-docs-tidb-operator-zh.sh",
    "download:docs-dm": "node markdown-pages/cli.js download docs-dm",
    "download:docs-dm:all": "./scripts/download-docs-dm.sh",
    "download:docs-dm:en:all": "./scripts/download-docs-dm-en.sh",
    "download:docs-dm:zh:all": "./scripts/download-docs-dm-zh.sh"
  }
}
```

But the download commands must pass some parameters to work properly. You can understand that it is just a partial command. For example, run:

```sh
node markdown-pages/cli.js help
```

You will see:

```sh
cli.js [command]

Commands:
  cli.js download <repo> [path] [ref]  specify which repo of docs you want to
                                       download
  cli.js sync <repo> <ref> <sha>       Sync the docs' changes by a single commit

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

Let us explain with this example: `yarn download:docs-tidb-operator en master`.

This will expand as: `node markdown-pages/cli.js download docs-tidb-operator en master`.

The `<repo>` is `docs-tidb-operator`, which is required. It means we will download the docs from this repo.

The second, `[path]` is a subpath of the repo. In <https://github.com/pingcap/docs-tidb-operator>, we want to download all docs under the `en`.

The last, `[ref]` is the branch of the repo. In this example, we want to download All documents in the `master` branch, under the `en` folder.

Other usage methods can refer to `scripts/download-*.sh`.

### After download

Run `yarn start` to develop:

```sh
yarn start
```

### CI

We use GitHub actions to serve the build and deploy.

The core of the CI is using `repository_dispatch` event which described at <https://help.github.com/en/actions/reference/events-that-trigger-workflows#external-events-repository_dispatch>.

Once outside repo post this event, the master branch workflow will start to update the website.

For more details, view: <https://github.com/pingcap/website-docs/blob/master/.github/workflows/update.yml>

### GitHub Outh2 token

Because of most of our text data stored in GitHub. So, It's needed to apply a GitHub API token in development **when you are prompted for `rate-limiting`**.

For more details, view <https://developer.github.com/v3/#rate-limiting>

You must set the token as an env when you start some commands, defined as:

```sh
GITHUB_AUTHORIZATION_TOKEN=token
```

Some scripts will need this env variable, for example:

```sh
GITHUB_AUTHORIZATION_TOKEN=token yarn download:docs-tidb-operator en master
```

## The rules we followed

For better collaboration and review, we have developed a few rules to help us develop better.

- [JS](#js)
- [Styles](#styles)
- [Be Compact](#be-compact)
- [Necessary Test](#necessary-test)

**Before you contribute, you must read the following carefully.**

### JS

First, we use [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged) to make [prettier](https://prettier.io/) format our code automatically before commit.

And also, because some of us use vscode to develop the dashboard, we recommend to use [sort-imports](https://marketplace.visualstudio.com/items?itemName=amatiasq.sort-imports) to format all imports. (This is optional, we will not force you to use)

### Styles

Currently, we use `sass` to style each pages and components.

We hope you can follow this order **(Don't care about their value)** to organize all styles:

```scss
// Position first
position: relative;
top: 0;
bottom: 0;
left: 0;
right: 0;
// Then display
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
// Layout
width: 0;
height: 0;
margin: 0;
padding: 0;
// Colors
background: #fff;
color: #000;
// Outside
border: 0;
box-shadow: none;
// Finally, not often used values can be in any order
```

### Be Compact

**Don't include no used deps.**

**Don't let your code be too long-winded, there will be a lot of elegant writing.**

### Necessary Test

**Every new features must have a unit test.**

## Shortcodes

Currently, you can use these shortcodes into docs:

### Shortcodes for notification

```html
<Note>This is a note.</Note>

<Warning>This is a warning.</Warning>

<Tips>This is a tip.</Tips>

<Error>This is an error.</Error>

<Important>This is an important message.</Important>
```

Everything you needed is just to write a JSX tag, put the text into it. Then we will use
`mdx` to convert it to JS code.

### Shortcodes for tab panels

**Each label in a single doc have to be unique.**

```html
<SimpleTab>
<div label="LABEL_SHOW_ON_FIRST_TAB">

This is the first content, which is markdown format. The content will show on the corresponding panel when users switch the tabs.

</div>

<div label="LABEL_SHOW_ON_SECOND_TAB">

This is the second content.

</div>
</SimpleTab>
```

## Landing page for TiDB

Edit file `_index.md` in each doc repo to custom its landing page.

All columns have to be wrapped by tag `<NavColumns></NavColumns>`, each column has to be wrapped by tag `<NavColumn></NavColumn>`and column title has to be wrapped by tag `<ColumnTitle></ColumnTitle>`. For example:

```jsx
<NavColumns>
<NavColumn>
<ColumnTitle>Column title</ColumnTitle>
- [This is nav](/fileName.md)
- [This is nav](/fileName.md)
- [This is nav](/fileName.md)
- [This is nav](/fileName.md)
</NavColumn>

<NavColumn>
<ColumnTitle>Column title</ColumnTitle>
- [This is nav](/fileName.md)
- [This is nav](/fileName.md)
- [This is nav](/fileName.md)
- [This is nav](/fileName.md)
</NavColumn>
</NavColumns>
```

## Authors

PingCAP FE
