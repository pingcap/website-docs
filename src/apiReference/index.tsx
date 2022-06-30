import { Layout } from 'layout'
import { useEffect } from 'react'

declare const Redoc: any

async function loadScript(scriptSrc: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = scriptSrc
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function APIReferenceTemplate() {
  // const redocHtml = `<redoc spec-url="http://petstore.swagger.io/v2/swagger.json"></redoc>`
  // const specUrl = `http://petstore.swagger.io/v2/swagger.json`
  const specUrl = `https://raw.githubusercontent.com/pingcap/docs/tmp-redoc/tidb-cloud/openapi-spec.swagger.json`

  useEffect(() => {
    async function setupRedoc() {
      if (typeof Redoc === 'undefined')
        await loadScript(
          'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js'
        )

      Redoc.init(
        specUrl,
        {
          scrollYOffset: 50,
        },
        document.getElementById('redoc-container')
      )
    }

    setupRedoc()
  })

  return (
    <>
      <div id="redoc-container" data-testid="redoc-container" />
    </>
  )
}
