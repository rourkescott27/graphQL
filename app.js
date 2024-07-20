const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphqltutorial.j0jh9pa.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=graphqlTutorial`
  ).then(() => {
    app.listen(3000);
  }).catch(err => {
    console.log('Connection failed:', err);
  });
