# @pingcap/docs-download

Retrieve docs from all PingCAP Docs repos.

## Usage

```shell
npx @pingcap/docs-download [options]
# or
npx pingcap-docs-download [options]
```

View all options:

```shell
npx @pingcap/docs-download --help
```

Example output:

```shell
pingcap-docs-download [command]

Commands:
  pingcap-docs-download download <repo> [path] [ref]           specify which repo of docs you want to download
                                                                                                           [aliases: dl]
  pingcap-docs-download clean <path>                           use rimraf to delete                        [aliases: cl]
  pingcap-docs-download sync <repo> [ref] <base> <head>        Synchronize doc changes between base and head
  pingcap-docs-download generate <repo> [ref] <from> [output]  generate content from a outline            [aliases: gen]

Options:
  -h, --help                 Show help                                                                         [boolean]
      --version              Show version number                                                               [boolean]
      --destination, --dest  The root directory where documents are stored          [string] [default: "markdown-pages"]
      --config               Specify the config                                          [string] [default: "docs.json"]
  -d, --debug                Print debug information at runtime                               [boolean] [default: false]
      --dry-run              Dry run mode does not download docs                              [boolean] [default: false]
```

Let us explain with this example: `npx @pingcap/docs-download download pingcap/docs-tidb-operator en --ref master`.

The `<repo>` is [docs-tidb-operator](https://github.com/pingcap/docs-tidb-operator), which is required. It means we will download the docs from this repo.

The second, `[path]` is a subpath of the repo. We want to download all docs under the `en` directory.

The last, `[ref]` is the branch of the repo. In this example, we want to download all docs in the `master` branch.

## Rate limiting

You can put `GITHUB_AUTHORIZATION_TOKEN=token` in an `.env` file to avoid the rate limit.

## License

MIT
