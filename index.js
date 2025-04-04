const { ApolloServer, gql } = require("apollo-server");
const { AmplienceSDK } = require("./getPage");

// Step 1: Define the GraphQL Schema

const typeDefs = gql`
  scalar JSON
  scalar Timestamp

  type Query {
    hello: String
    getAmplienceContent(
      deliveryKey: String
      preview: Boolean
      timestamp: Timestamp
      page: String
      productid: String
    ): AmplienceContent
  }

  type AmplienceContent {
    page: Page
  }

  type Page {
    slots: JSON
  }
`;

// Step 2: Define the Resolvers
const resolvers = {
  Query: {
    hello: () => {
      return "Hello, world!";
    },
    async getAmplienceContent(_parent, args) {
      const amplienceInstance = new AmplienceSDK();
      await amplienceInstance.init(args.preview, args.timestamp);
      const result = await amplienceInstance.getModule(args);
      return { page: { ...result } };
    },
  },
};

// Step 3: Set up the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

// Step 4: Launch the server
server.listen({ port: 3000, path: "/graphql" }).then(({ url }) => {
  console.log(`Server ready at ${url}graphql`);
});
