import { box, title } from './404.module.scss'

import { Link } from 'gatsby-plugin-react-i18next'
import { Seo } from 'components/Seo'
import { graphql } from 'gatsby'

const NotFoundPage = () => (
  <>
    <Seo title="404 Not Found" noindex />
    <div className={box}>
      <h1 className={title}>Sorry...404!</h1>
      <main>
        The page you were looking for appears to have been moved, deleted or
        does not exist. You could go back to where you were or head straight to
        our <Link to="/">home page</Link>.
      </main>
    </div>
  </>
)

export default NotFoundPage

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
