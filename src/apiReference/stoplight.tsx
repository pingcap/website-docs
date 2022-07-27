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

export default function APIReferenceStoplightTemplate() {
  const specUrl = `https://download.pingcap.org/tidbcloud-oas.json`

  useEffect(() => {
    async function setupRedoc() {
      await loadScript(
        'https://unpkg.com/@stoplight/elements/web-components.min.js'
      )

      loadLink(`https://unpkg.com/@stoplight/elements/styles.min.css`)
    }

    setupRedoc()
  })

  const eleStr = `<elements-api apiDescriptionUrl="${specUrl}" router="hash" layout="sidebar"/>`

  return (
    <>
      <Seo title="TiDB Cloud API" noindex />
      <div dangerouslySetInnerHTML={{ __html: eleStr }} />
    </>
  )
}
