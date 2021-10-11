import {
  Block,
  Column,
  Columns,
  Container,
  Section,
} from '@seagreenio/react-bulma'
import React, { useEffect } from 'react'

import Footer from 'components/footer'
import Navbar from 'components/navbar'
import PropTypes from 'prop-types'
import Toc from 'components/toc'
import VersionSwitcher from 'components/versionSwitcher'
import { globalHistory } from '@reach/router'
import { navigate } from 'gatsby'
import { useSelector } from 'react-redux'

const Layout = ({
  children,
  pageContext: { name, docVersionStable, versions },
}) => {
  const docVersionStableMap = JSON.parse(docVersionStable)

  const { toc } = useSelector(state => state.docData)

  useEffect(() => {
    if (!window.DOCS_PINGCAP) {
      window.DOCS_PINGCAP = {
        globalHistory,
        navigate,
      }
    }
  }, [])

  return (
    <>
      <Navbar />
      <Section as="main">
        <Container>
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
                  {toc && (
                    <Block>
                      <Toc data={toc} docVersionStable={docVersionStableMap} />
                    </Block>
                  )}
                </div>
              </Column>
              {children}
            </Columns>
          </article>
        </Container>
      </Section>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  pageContext: PropTypes.object.isRequired,
}

export default Layout
