import { useEffect } from 'react'
import { Seo } from 'components/Seo'
// ! Do Not import any css file here.

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

function loadLink(href: string) {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.href = href
  link.rel = 'stylesheet'
  document.head.appendChild(link)
}

export default function APIReferenceTemplate() {
  const redocCorsProxy = `https://cors.redoc.ly`
  const specUrl = `https://download.pingcap.org/tidbcloud-oas.json`

  useEffect(() => {
    async function setupRedoc() {
      if (typeof Redoc === 'undefined')
        await loadScript(
          'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js'
        )

      loadLink(
        `https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700`
      )

      // https://redocly.com/docs/api-reference-docs/configuration/functionality/
      Redoc.init(
        `${redocCorsProxy}/${specUrl}`,
        {},
        document.getElementById('redoc-container')
      )
    }

    setupRedoc()
  })

  return (
    <>
      <Seo title="TiDB Cloud Open API" noindex />
      <div id="redoc-container" data-testid="redoc-container" />
    </>
  )
}
