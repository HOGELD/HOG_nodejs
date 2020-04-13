import { PubSub, GraphQLServer} from "graphql-yoga";
import { importSchema} from "graphql-import";
import jwt from 'jsonwebtoken';
import  mongoose  from 'mongoose';
import  dotenv from 'dotenv';
import resolvers from './graphql/resolvers';

const typeDefs = importSchema('graphql/schema/schema.graphql');

dotenv.config();

const pubsub = new PubSub();
const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: { pubsub }
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
});

mongoose.connection.once("open", () =>
    server.start({ port: process.env.PORT },() => console.log(`Running at localhost:${process.env.PORT}`))
);
