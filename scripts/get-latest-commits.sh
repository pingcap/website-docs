#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
CACHE_DIR="$DIR/../markdown-pages"
GITHUB_AUTHORIZATION_TOKEN=$1

# repos in pingcap
repos=(docs docs-cn docs-dm docs-tidb-operator docs-appdev)
docs=(master release-5.3 release-5.2 release-5.1 release-5.0 release-4.0 release-3.1 release-3.0 release-2.1)
docs_cn=(master release-5.3 release-5.2 release-5.1 release-5.0 release-4.0 release-3.1 release-3.0 release-2.1)
docs_dm=(master release-2.0 release-1.0)
docs_tidb_operator=(master release-1.2 release-1.1 release-1.0)
docs_appdev=(master)

for repo in ${repos[@]}
do
  repo_to_index="${repo//-/_}"
  versions=$repo_to_index[@]

  for v in ${!versions}
  do
    git ls-remote https://github.com/pingcap/$repo.git refs/heads/$v | awk '{ print $1 }' > $CACHE_DIR/$repo-$v.hash
    echo "$repo-$v.hash" $(cat $CACHE_DIR/$repo-$v.hash)
  done
done

# repos in tidbcloud
tidbcloud=(dbaas-docs)
dbaas_docs=(master)

for repo in ${tidbcloud[@]}
do
  repo_to_index="${repo//-/_}"
  versions=$repo_to_index[@]

  for v in ${!versions}
  do
    $(curl -s -H "Authorization: token $GITHUB_AUTHORIZATION_TOKEN" \
    -H "Accept: application/vnd.github.VERSION.sha" \
    "https://api.github.com/repos/tidbcloud/$repo/commits/$v") > $CACHE_DIR/$repo-$v.hash
    echo "$repo-$v.hash" $(cat $CACHE_DIR/$repo-$v.hash)
  done
done
