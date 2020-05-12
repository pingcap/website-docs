import React from 'react'
import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import TOC from '../components/toc'

export default function CreateDocPage({ data }) {
  const { mdx } = data
  const tocData = data.toc.edges
  return (
    <div>
      <MDXProvider>
        <TOC tocData={tocData} />
        <MDXRenderer>{mdx.body}</MDXRenderer>
      </MDXProvider>
    </div>
  )
}

export const docsQuery = graphql`
  query docsDataQuery(
    $id: String
    $relativePath: String
    $langCollection: String
  ) {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
      }
    }

    toc: allMdx(
      filter: {
        fields: {
          base: { base: { eq: "TOC.md" } }
          relativePath: { eq: $relativePath }
          langCollection: { eq: $langCollection }
        }
      }
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          body
        }
      }
    }
  }
`
