import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'

const TOC = ({ tocData }) => {
  return (
    <MDXProvider>
      {tocData.map((t, idx) => (
        <MDXRenderer key={idx}>{t.node.body}</MDXRenderer>
      ))}
    </MDXProvider>
  )
}

export default TOC
