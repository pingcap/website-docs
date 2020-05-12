import React from 'react'
import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import TOC from '../components/toc'

export default function Doc({ data }) {
  const { mdx, toc } = data

  return (
    <div>
      <MDXProvider>
        <TOC data={toc.nodes[0]} />
        <MDXRenderer>{mdx.body}</MDXRenderer>
      </MDXProvider>
    </div>
  )
}

export const query = graphql`
  query($id: String, $langCollection: String, $tocPath: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
      body
    }

    toc: allMdx(
      filter: {
        fields: {
          langCollection: { eq: $langCollection }
          relativePath: { eq: $tocPath }
        }
      }
    ) {
      nodes {
        frontmatter {
          title
        }
        body
      }
    }
  }
`
