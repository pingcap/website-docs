import Layout from '../components/layout'
import React from 'react'
import Seo from '../components/seo'

const IndexPage = ({ pageContext: { locale } }) => (
  <Layout locale={locale} langSwitchable={true}>
    <Seo title="Home" />
  </Layout>
)

export default IndexPage
