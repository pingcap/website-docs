import Layout from '../components/layout'
import React from 'react'
import SEO from '../components/seo'

const NotFoundPage = ({ pageContext: { locale } }) => (
  <Layout locale={locale}>
    <SEO title="404: Not Found" />
  </Layout>
)

export default NotFoundPage
