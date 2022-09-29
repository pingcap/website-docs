import algoliasearch from "algoliasearch";

const ApplicationID = process.env.GATSBY_ALGOLIA_APPLICATION_ID!;
const APIKey = process.env.GATSBY_ALGOLIA_API_KEY!;

export const algoliaClient = algoliasearch(ApplicationID, APIKey, {
  timeouts: {
    connect: 10,
    read: 10,
    write: 10,
  },
});
