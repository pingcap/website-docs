import Layout from '../components/layout'
import React from 'react'
import SEO from '../components/seo'
import IntlLink from '../components/IntlLink'
import '../styles/pages/404.scss'

const NotFoundPage = ({ pageContext: { locale } }) => (
  <Layout locale={locale}>
    <SEO title="404: Not Found" />
    <div className="PingCAP-404-Page">
      <section className="container">
        <h1>Sorry... 404!</h1>
        <p>
          The page you were looking for appears to have been moved, deleted or
          does not exist. You could go back to where you were or head straight
          to our{' '}
          <IntlLink to="/" type="aHrefLink">
            home page
          </IntlLink>
        </p>
      </section>
    </div>
  </Layout>
)

export default NotFoundPage
