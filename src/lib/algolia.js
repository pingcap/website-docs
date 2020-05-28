import algoliasearch from 'algoliasearch'

const ApplicationID = process.env.GATSBY_ALGOLIA_APPLICATION_ID
const APIKey = process.env.GATSBY_ALGOLIA_API_KEY

const client = algoliasearch(ApplicationID, APIKey)

export { client as algoliaClient }
