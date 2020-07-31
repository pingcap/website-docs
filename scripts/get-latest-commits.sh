#!/bin/bash
DIR=$(dirname "$0")
echo $DIR
GITHUB_AUTHORIZATION_TOKEN=$1

docs_repos=(docs-cn docs docs-dm docs-tidb-operator dbaas-docs)
docs_cn=(master release-4.0 release-3.1 release-3.0 release-2.1)
docs=(master release-4.0 release-3.1 release-3.0 release-2.1)
docs_dm=(master release-1.0)
docs_tidb_operator=(master release-1.1 release-1.0)
dbaas_docs=(master)

for docs_repo in "${docs_repos[@]}"
do
    docs_vers="${docs_repo//-/_}"
    versions=${docs_vers}[@]
    for v in "${!versions}"
    do
       curl -H "Authorization: token $GITHUB_AUTHORIZATION_TOKEN" -s "https://api.github.com/repos/pingcap/$docs_repo/commits/$v"|\
         python3 -c "import sys,json; print(json.load(sys.stdin)['sha'])" > $DIR/../markdown-pages/contents/$docs_repo-$v-hash.lock
        echo "$docs_repo-$v-hash.lock"
        cat $DIR/../markdown-pages/contents/$docs_repo-$v-hash.lock
    done
done
