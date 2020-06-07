import { PubSub, GraphQLServer} from "graphql-yoga";
import  mongoose  from 'mongoose';
import  dotenv from 'dotenv';

const resolvers = require('./graphql/resolvers/index');
dotenv.config();

const pubsub = new PubSub();
const server = new GraphQLServer({
    typeDefs: 'graphql/schema/schema.graphql',
    resolvers,
    context: { pubsub }
});

const options = {
    port: process.env.PORT,
    endpoint: '/graphql',
    subscriptions: `/subscriptions`,
    playground: '/playground',
    introspection:true
}

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
});

mongoose.connection.once("open", () =>
    server.start(options,() => console.log(`Running at localhost:${process.env.PORT}`))
);
