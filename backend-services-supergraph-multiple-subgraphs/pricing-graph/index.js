import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import fetch from "node-fetch";

const port = 4000;
const apiUrl = "http://localhost:4040";

const typeDefs = gql`
    type Price {
        id: ID!
        referenceEntityId: Int!
        entityPrice: PriceDetails
        serviceCharges: ServiceCharges
    }
    type PriceDetails {
        amount: Float
        currency: String
    }
    type ServiceCharges {
        stream: PriceDetails
        support: PriceDetails
    }
    type Query {
        price(id: ID!): Price
        prices: [Price]
    }
`;

const resolvers = {
    Query: {
        price(_, { id }) {
            return fetch(`${apiUrl}/prices/${id}`).then(res => res.json());
        },
        prices() {
            return fetch(`${apiUrl}/prices`).then(res => res.json());
        }
    },
    Price: {
        async __resolveReference(ref) {
            const res = await fetch(`${apiUrl}/prices?referenceEntityId=${ref.referenceEntityId}`);
            const result = await res.json();
            return result[0];
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
    console.log(`Prices subgraph has successfully started and listening at ${url}`);
});