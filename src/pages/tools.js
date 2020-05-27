import '../styles/components/toolsLandingPage.scss'

import Layout from '../components/layout'
import React from 'react'
import SEO from '../components/seo'

import { toolsLandingPageData } from '../data/toolsLandingPage'

const Tools = ({ pageContext: { locale } }) => {
  return (
    <Layout locale={locale}>
      <SEO title="Tools" />
      <div className="PingCAP-Tools">
        <section className="section container">
          <div className="columns is-multiline is-variable is-8">
            {toolsLandingPageData.map((tool) => (
              <div key={tool.type} className="column is-6">
                <a href={tool.link}>
                  <div className="card">
                    <div className="header">
                      <div className="title">{tool.type}</div>
                      <div
                        className={`type-icon ${tool.type
                          .replace(' ', '-')
                          .toLowerCase()}-icon`}
                      ></div>
                    </div>
                    <div className="desc">{tool.desc}</div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Tools
