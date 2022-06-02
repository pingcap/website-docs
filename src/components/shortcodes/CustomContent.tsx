import { useEffect, useState } from 'react'

export const CustomContent = (props: { platform: string; children: any }) => {
  const { platform: pageType, children } = props
  const [shouldDisplay, setShouldDisplay] = useState(true)
  useEffect(() => {
    const currentPath = window?.location?.pathname || ''
    if (currentPath.includes(`/${pageType}/`)) {
      setShouldDisplay(true)
    } else {
      setShouldDisplay(false)
    }
  }, [])
  return <>{shouldDisplay ? children : <></>}</>
}
