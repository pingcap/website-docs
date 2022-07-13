import { useEffect } from 'react'
import { Seo } from 'components/Seo'

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
  const specUrl = `https://download.pingcap.org/tidbcloud-oas.json`

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
      <Seo title="TiDB Cloud Open API" noindex />
      <div id="redoc-container" data-testid="redoc-container" />
    </>
  )
}
