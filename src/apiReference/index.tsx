import { Layout } from 'layout'

export default function APIReferenceTemplate() {
  const redocHtml = `<redoc spec-url="http://petstore.swagger.io/v2/swagger.json"></redoc>`
  return (
    <>
      <Layout>
        {/* <redoc spec-url="http://petstore.swagger.io/v2/swagger.json"></redoc> */}
        <div dangerouslySetInnerHTML={{ __html: redocHtml }} />
      </Layout>
    </>
  )
}
