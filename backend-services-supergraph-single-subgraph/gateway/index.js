import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";

const port = 5000;

const gateway = new ApolloGateway({
    serviceList: [
        {
            name: "movies", url: "http://localhost:3000"
        }
    ]
});

const server = new ApolloServer({
    gateway,
    subscriptions: false
});

server.listen({ port }).then(({ url }) => {
    console.log(`Supergraph with gateway has successfully started and listening at ${url}`);
});