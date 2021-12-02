import { Block, Columns } from '@seagreenio/react-bulma'

import Default from './default'
import PropTypes from 'prop-types'
import React from 'react'
import Toc from 'components/toc'
import VersionSwitcher from 'components/versionSwitcher'
import { useSelector } from 'react-redux'

const Layout = ({
  children,
  pageContext: { name, docVersionStable, pathWithoutVersion, versions },
}) => {
  const docVersionStableMap = JSON.parse(docVersionStable)

  const { toc } = useSelector(state => state.docData)

  return (
    <Default>
      <article className="PingCAP-Doc">
        <Columns>
          <div className="column is-one-fifth">
            <div className="left-aside">
              <Block>
                <VersionSwitcher
                  name={name}
                  docVersionStable={docVersionStableMap}
                  pathWithoutVersion={pathWithoutVersion}
                  versions={versions}
                />
              </Block>
              {toc && (
                <Toc
                  data={toc}
                  name={name}
                  docVersionStable={docVersionStableMap}
                />
              )}
            </div>
          </div>
          {children}
        </Columns>
      </article>
    </Default>
  )
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  pageContext: PropTypes.object.isRequired,
}

export default Layout
