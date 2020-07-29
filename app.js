const express = require('express');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Advertise = require('./models/advertise');

const app = express();


app.use(bodyParser.json());

app.use('/graphql',
    expressGraphQL({
    schema:buildSchema(`
        type Advertise{
            _id: ID!
            title:String!
            description:String!
            price:Float!
            date:String!
        }

        input AdvertiseInput {
            title:String!
            description:String!
            price:Float!
        }

        type RootQuery {
            advertises: [Advertise!]!
        }

        type RootMutation {
            createAdvertise(advertiseInput:AdvertiseInput): Advertise
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue:{
        advertises: () => {
            return Advertise
                        .find({})
                        .then(adverises => {
                            return adverises.map(advert =>{
                                return {...advert._doc}
                            })
                        })
                        .catch(err => {
                            throw err;
                        });
        },

        createAdvertise: (args) => {
            const advertise = new Advertise({
                title: args.advertiseInput.title,
                description:args.advertiseInput.description,
                price:args.advertiseInput.price,
                date: new Date(),
            });

            return advertise
                .save()
                .then(res => {
                    console.log(res);
                    return {...res._doc}
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                })

            
        }
    },
    graphiql:true,
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
    }@graphqldb.ddrph.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(()=> app.listen(8000) )
    .catch(err => console.log(err))

