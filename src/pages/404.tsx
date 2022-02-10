import { box, content, title } from './404.module.scss'

import { Link } from 'gatsby-plugin-react-intl'
import { Seo } from 'components/Seo'

const NotFoundPage = () => (
  <>
    <Seo title="404 Not Found" noindex />
    <div className={box}>
      <h1 className={title}>Sorry...404!</h1>
      <main className={content}>
        The page you were looking for appears to have been moved, deleted or
        does not exist. You could go back to where you were or head straight to
        our <Link to="/">home page</Link>.
      </main>
    </div>
  </>
)

export default NotFoundPage
