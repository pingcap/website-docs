import { useEffect, useState } from 'react'

export const CustomContent = (props: { platform: string; children: any }) => {
  // type platform = "tidb" | "tidb-cloud"
  const { platform: pageType, children } = props
  const [shouldDisplay, setShouldDisplay] = useState(true)
  useEffect(() => {
    const currentPath = window?.location?.pathname || ''
    if (currentPath.includes(`/${pageType.replace('-', '')}/`)) {
      setShouldDisplay(true)
    } else {
      setShouldDisplay(false)
    }
  }, [])
  return <>{shouldDisplay ? children : <></>}</>
}
