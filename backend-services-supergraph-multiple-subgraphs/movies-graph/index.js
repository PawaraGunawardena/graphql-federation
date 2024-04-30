import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import fetch from "node-fetch";

const apiUrl = "http://localhost:3030";
const port = 3000;

const typeDefs = gql`
    type Movie @key(fields: "id"){
        id: ID!
        name: String
        duration: Int
        genre: String
        views: Int
        priceDetails: Price
    }

    type Query {
        movies: [Movie]
    }

    extend type Price @key(fields: "referenceEntityId") {
        referenceEntityId: Int! @external
    }
`;

const resolvers = {
    Query: {
        async movies() {
            const res = await fetch(`${apiUrl}/movies`);
            return await res.json();
        }
    },
    Movie: {
        priceDetails(movie) {
            const {id} = movie;
            return {__typename: 'Price', referenceEntityId: id}
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
    console.log(`Movie subgraph has successfully started and listening at ${url}`);
});