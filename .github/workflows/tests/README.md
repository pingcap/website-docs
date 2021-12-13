# Tests

This doc describe how to test `update` workflow in local environment.

## How to

We use [act](https://github.com/nektos/act) to test workflow (Docker environment is also needed). After install it, you can run `act` command to test workflow:

```shell
act repository_dispatch
# For Apple M1 chip
act repository_dispatch --container-architecture linux/amd64
```

To test the `Document Synchronization`, you need to use the additional files. Some sample files are listed in the `sync` folder.

Example commands:

```shell
# First
act repository_dispatch --container-architecture linux/amd64 -e .github/workflows/tests/sync/client_payload.dm.base.json -r
# Then
act repository_dispatch --container-architecture linux/amd64 -e .github/workflows/tests/sync/client_payload.dm.head.json -r
```

You must provide two json files with different sha's to complete this test. The file structure is as follows:

```json
// client_payload.dm.base.json
{
  "client_payload": {
    "repo": "pingcap/docs-dm",
    "ref": "master",
    "sha": "46ac7dfbe7328232ac7e9e89279265f5e6fed9d6"
  }
}
```

The sha of `.head.json` is needed to behind the `.base.json`.
