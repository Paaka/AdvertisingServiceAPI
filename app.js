const express = require('express');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/graphql',
    expressGraphQL({
    schema:buildSchema(`
        type RootQuery {
            advertises: [String!]!
        }

        type RootMutation {
            createAdvertise(name:String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue:{
        advertises: () => {
            return ['Toyota Celica', 'Fiat 500'];
        },

        createAdvertise: (args) => {
            const advertiseName = args.name;

            return advertiseName;
        }
    },
    graphiql:true,
}))

app.listen(8000);