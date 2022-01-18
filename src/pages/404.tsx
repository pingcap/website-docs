import { box } from './404.module.scss'

import { Content, Title } from '@seagreenio/react-bulma'

import { Link } from 'gatsby-plugin-react-intl'
import { Seo } from 'components/Seo'

const NotFoundPage = () => (
  <>
    <Seo title="404 Not Found" />
    <div className={box}>
      <Title as="h1">Sorry...404!</Title>
      <Content>
        The page you were looking for appears to have been moved, deleted or
        does not exist. You could go back to where you were or head straight to
        our <Link to="/">home page</Link>.
      </Content>
    </div>
  </>
)

export default NotFoundPage
