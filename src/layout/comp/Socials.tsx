import { en, zh, ja } from './socials.data'

import clsx from 'clsx'
import { Locale } from 'typing'

interface Props {
  locale: Locale
  className?: string
}

export const Socials = ({ locale, className }: Props) => {
  const getSocialsData = (lang: string) => {
    let result = en
    switch (lang) {
      case 'zh':
        result = zh
        break
      case 'ja':
        result = ja
        break
      default:
        break
    }
    return result
  }
  const data = getSocialsData(locale)

  return (
    <>
      {data &&
        data.map(social => (
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          <a
            key={social.name}
            className={clsx('social', social.name, className)}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
            aria-label={social.name}
          />
        ))}
    </>
  )
}
