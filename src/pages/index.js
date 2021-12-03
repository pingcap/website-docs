import Layout from '../components/layout'
import React from 'react'
import SEO from '../components/seo'

const IndexPage = ({ pageContext: { locale } }) => (
  <Layout locale={locale}>
    <SEO title="Home" />
  </Layout>
)

export default IndexPage
