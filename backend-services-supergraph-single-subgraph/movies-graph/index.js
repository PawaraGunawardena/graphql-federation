import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import fetch from "node-fetch";

const apiUrl = "http://localhost:3030";
const port = 3000;

const typeDefs = gql`
    # movie type defines the queryable fields of Movie
    type Movie @key(fields: "id"){
        id: ID!
        name: String
        duration: Int
        genre: String
        views: Int
    }

    # Query type of the movies graph returns the movies sub graph shape
    type Query {
        movies: [Movie]
    }
`;

const resolvers = {
    Query: {
        async movies() {
            const res = await fetch(`${apiUrl}/movies`);
            return await res.json();
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
    console.log(`Movie Subgraph has successfully started and listening at ${url}`);
});