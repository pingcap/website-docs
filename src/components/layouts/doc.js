import { Block, Column, Columns } from '@seagreenio/react-bulma'

import Default from './default'
import PropTypes from 'prop-types'
import React from 'react'
import Toc from 'components/toc'
import VersionSwitcher from 'components/versionSwitcher'
import { useSelector } from 'react-redux'

const Layout = ({
  children,
  pageContext: { name, docVersionStable, versions },
}) => {
  const docVersionStableMap = JSON.parse(docVersionStable)

  const { toc } = useSelector(state => state.docData)

  return (
    <Default>
      <article className="PingCAP-Doc">
        <Columns gap={6}>
          <Column size={2}>
            <div className="left-aside">
              <Block>
                <VersionSwitcher
                  name={name}
                  docVersionStable={docVersionStableMap}
                  versions={versions}
                />
              </Block>
              {toc && <Toc data={toc} docVersionStable={docVersionStableMap} />}
            </div>
          </Column>
          {children}
        </Columns>
      </article>
    </Default>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  pageContext: PropTypes.object.isRequired,
}

export default Layout
