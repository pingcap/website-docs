import '../styles/pages/tools.scss'

import Layout from '../components/layout'
import React from 'react'
import SEO from '../components/seo'
import { Link } from 'gatsby'

import { toolsLandingPageData } from '../data/tools'
import { FormattedMessage } from 'react-intl'

const Tools = ({ pageContext: { locale } }) => {
  return (
    <Layout locale={locale}>
      <SEO title="Tools" />
      <div className="PingCAP-Tools">
        <section className="section container">
          <div className="columns is-multiline is-variable is-8">
            {toolsLandingPageData.map((tool) => (
              <div key={tool.iconName} className="column is-6">
                <Link to={`${locale === 'zh' ? '/zh' + tool.link : tool.link}`}>
                  <div className="card">
                    <div className="header">
                      <div className="title">
                        {<FormattedMessage id={tool.type} />}
                      </div>
                      <div className={`type-icon ${tool.iconName}-icon`}></div>
                    </div>
                    <div className="desc">
                      {<FormattedMessage id={tool.desc} />}

                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Tools
