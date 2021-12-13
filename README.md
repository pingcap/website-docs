<p align="center">
  <img src="images/pingcap-icon.png" width="128" alt="PingCAP Logo" />
</p>
<h1 align="center">website-docs</h1>

<p align="center">The next generation of PingCAP Docs. Powered by Gatsby ⚛️.</p>

[![Incremental Build Triggered By Push Events](https://github.com/PingCAP/website-docs/actions/workflows/update.yml/badge.svg?event=repository_dispatch)](https://github.com/PingCAP/website-docs/actions/workflows/update.yml)

## How to develop

After clone this repo, run `yarn` to get all deps:

```sh
yarn
```

Usually you have to download some docs before dev. We have pre-defined some commands to download the docs and clean docs, these commands are:

```json
{
  "scripts": {
    "download:tidb:en": "pingcap-docs-download dl pingcap/docs",
    "download:tidb:en:all": "./scripts/download-tidb-en.sh",
    "download:tidb:zh": "pingcap-docs-download dl pingcap/docs-cn",
    "download:tidb:zh:all": "./scripts/download-tidb-zh.sh",
    "download:dm": "pingcap-docs-download dl pingcap/docs-dm",
    "download:dm:all": "./scripts/download-dm.sh",
    "download:dm:en:all": "./scripts/download-dm-en.sh",
    "download:dm:zh:all": "./scripts/download-dm-zh.sh",
    "download:tidb-operator": "pingcap-docs-download dl pingcap/docs-tidb-operator",
    "download:tidb-operator:all": "./scripts/download-tidb-operator.sh",
    "download:tidb-operator:en:all": "./scripts/download-tidb-operator-en.sh",
    "download:tidb-operator:zh:all": "./scripts/download-tidb-operator-zh.sh",
    "download:dbaas": "pingcap-docs-download dl tidbcloud/dbaas-docs",
    "download:dbaas:all": "./scripts/download-dbaas.sh",
    "download:appdev": "pingcap-docs-download dl pingcap/docs-appdev",
    "download:appdev:all": "./scripts/download-appdev.sh",
    "download:appdev:en:all": "./scripts/download-appdev-en.sh",
    "download:appdev:zh:all": "./scripts/download-appdev-zh.sh",
    "clean:docs": "pingcap-docs-download cl",
    "sync": "pingcap-docs-download sync"
  }
}
```

There are two types of scripts here, one starts with `pingcap-docs-download` and the other starts with `./scripts`.

For `pingcap-docs-download`, it's an package binary which you can find the definition in [packages/download/package.json](packages/download/package.json). You must add some parameters to exec it.

Please refer to [packages/download/README.md](packages/download/README.md) for more details.

And all scripts in `./scripts` are already predefined commands, they use `pingcap-docs-download` to download the docs.

### After download

Run `yarn start` to develop:

```sh
yarn start
```

In order to debug algolia searches, you need to provide two additional environment variables:

- `GATSBY_ALGOLIA_APPLICATION_ID`
- `GATSBY_ALGOLIA_API_KEY`

Put them in `.env.development` to make them take effect. (Ref: <https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/>)

### GitHub Outh2 token

Because of most of our text data stored in GitHub. It's needed to apply a GitHub API token in development **when you are prompted for `rate-limiting`**.

For more details, view <https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting>.

You must set the token as an env when you start some commands, defined as:

```sh
GITHUB_AUTHORIZATION_TOKEN=token
```

### CI

We use GitHub actions to serve the build and deploy.

The core of the CI is using `repository_dispatch` event which described at <https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#repository_dispatch>.

Once outside repo post this event, the master branch workflow will start to update the website.

For more details, view: <https://github.com/pingcap/website-docs/blob/master/.github/workflows/update.yml>.

For how to test CI, view: [.github/workflows/tests/README.md](.github/workflows/tests/README.md).

## The rules we followed

For better collaboration and review, we have developed a few rules to help us develop better.

- [JS](#js)
- [Styles](#styles)
- [Be Compact](#be-compact)
- [Necessary Test](#necessary-test)

**Before you contribute, you must read the following carefully.**

### JS

First, we use [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged) to make [prettier](https://prettier.io/) format our code automatically before commit.

And also, because some of us use vscode to develop, we recommend to use [sort-imports](https://marketplace.visualstudio.com/items?itemName=amatiasq.sort-imports) to format all imports. (This is optional, we will not force you to use)

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

### Notifications

```jsx
<Note>This is a note.</Note>

<Warning>This is a warning.</Warning>

<Tips>This is a tip.</Tips>

<Error>This is an error.</Error>

<Important>This is an important message.</Important>
```

Everything you needed is just to write a JSX tag, put the text into it. Then we will use
`mdx` to convert it to JS code.

### Tab Panels

**Each label in a single doc have to be unique.**

```jsx
<SimpleTab>
  <div label="LABEL_SHOW_ON_FIRST_TAB">
    This is the first content, which is markdown format. The content will show
    on the corresponding panel when users switch the tabs.
  </div>

  <div label="LABEL_SHOW_ON_SECOND_TAB">This is the second content.</div>
</SimpleTab>
```

## Landing page for TiDB

Edit file `_index.md` in each doc repo to custom its landing page.

All columns have to be wrapped by tag `<NavColumns></NavColumns>`, each column has to be wrapped by tag `<NavColumn></NavColumn>`and column title has to be wrapped by tag `<ColumnTitle></ColumnTitle>`. For example:

```jsx
<NavColumns>
  <NavColumn>
    <ColumnTitle>Column title</ColumnTitle>- [This is nav](/fileName.md) - [This
    is nav](/fileName.md) - [This is nav](/fileName.md) - [This is
    nav](/fileName.md)
  </NavColumn>

  <NavColumn>
    <ColumnTitle>Column title</ColumnTitle>- [This is nav](/fileName.md) - [This
    is nav](/fileName.md) - [This is nav](/fileName.md) - [This is
    nav](/fileName.md)
  </NavColumn>
</NavColumns>
```

## License

MIT
