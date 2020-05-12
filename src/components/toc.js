import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'

const TOC = ({ data }) => {
  return (
    <MDXProvider>
      <MDXRenderer>{data.body}</MDXRenderer>
    </MDXProvider>
  )
}

export default TOC
