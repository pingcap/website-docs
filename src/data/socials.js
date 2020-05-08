const followSocials = [
  {
    name: 'twitter',
    href: 'https://twitter.com/PingCAP',
  },
  {
    name: 'facebook',
    href: 'https://facebook.com/pingcap2015',
  },
  {
    name: 'linkedin',
    href: 'https://linkedin.com/company/pingcap',
  },
  {
    name: 'reddit',
    href: 'https://reddit.com/r/TiDB/',
  },
  {
    name: 'slack',
    href: 'https://pingcap.com/tidbslack',
  },
  {
    name: 'youtube',
    href: 'https://youtube.com/channel/UCuq4puT32DzHKT5rU1IZpIA',
  },
]

const shareSocials = (link, title) => [
  {
    name: 'twitter',
    href: `https://twitter.com/intent/tweet?text=${title}&url=${link}`,
  },
  {
    name: 'facebook',
    href: `https://facebook.com/sharer/sharer.php?u=${link}`,
  },
  {
    name: 'linkedin',
    href: `https://linkedin.com/shareArticle?mini=true&url=${link}&title=${title}`,
  },
  {
    name: 'reddit',
    href: `https://reddit.com/submit?url=${link}&title=${title}`,
  },
  {
    name: 'yc',
    href: `https://news.ycombinator.com/submitlink?u=${link}&t=${title}`,
  },
]

export { followSocials, shareSocials }
