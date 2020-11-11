import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
// import * as Express from 'express';
import Express from 'express'; // "allowSyntheticDefaultImports": true,
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
import { LoginResolver } from './modules/user/Login';
import { MeResolver } from './modules/user/Me';
import { ConfirmUserResolver } from './modules/user/ConfirmUser';
import { ForgotPasswordResolver } from './modules/user/ForgotPassword';

const main = async () => {
  await createConnection();
  const schema = await buildSchema({
    // resolvers: [
    //   MeResolver,
    //   RegisterResolver,
    //   LoginResolver,
    //   ConfirmUserResolver,
    //   ForgotPasswordResolver,
    // ],
    resolvers: [__dirname + '/modules/**/*.ts'],

    // authChecker: ({ context: { req } }) => {
    //   // here we can read the user from context
    //   // and check his permission in the db against the `roles` argument
    //   // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

    //   console.log('req.session.userID', req.session.userId);

    //   return !!req.session.userId;
    //   //return true; // or false if access is denied
    // },
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    }),
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: 'qid',
      secret: 'graphql',
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 365 * 7, // 7 years
      },
    }),
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started on http://localhost:4000');
  });
};

main();
