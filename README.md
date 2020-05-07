<p align="center">
  <img src="images/pingcap-icon.png" width="128" alt="PingCAP Logo" />
</p>
<h1 align="center">docs-ng</h1>

<p align="center">The next generation of PingCAP Docs. Powered by Gatsby ⚛️.</p>

> Note: Currently WIP

## How to develop

After clone this repo, run `yarn` to get all deps:

```sh
yarn
```

We have pre-defined some commands to download the docs and clear docs, these commands are:

```json
{
  "scripts": {
    "clean:docs": "rimraf markdown-pages/contents/**/*.md",
    "download:docs": "node markdown-pages/cli.js download docs",
    "download:docs-cn": "node markdown-pages/cli.js download docs-cn",
    "download:docs-tidb-operator": "node markdown-pages/cli.js download docs-tidb-operator",
    "download:docs-dm": "node markdown-pages/cli.js download docs-dm"
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

### After the download

Run `yarn start` to develop:

```sh
yarn start
```

### GitHub Outh2 token

Because of most of our text data stored in GitHub. So, It's needed to apply a GitHub API token in development **when you are prompted for `rate-limiting`**.

For more details, view <https://developer.github.com/v3/#rate-limiting>

You must set the token as an env when you start some commands, for example:

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

## Authors

Made with love 💙 by PingCAP FE.
