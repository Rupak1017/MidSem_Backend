import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.use(express.json());

  const gqlserver = new ApolloServer({
    typeDefs: `
    type Query {
        hello: String
    }
    type Mutation {
        createUser(firstName: String!): Boolean

    }
 
    `,
    resolvers: {
      Query: {
        hello: () => `Hey there`,
      },
      Mutation:{
        createUser : async(_, 
          {firstName}: {firstName: string}) => {
            await prismaClient.user.create({
              data: {
                firstName
              },
            });
            return true;
          },
      },
    },
  });

  await gqlserver.start();

  app.get("/", (req, res) => {
    res.json({ message: "seevering" });
  });
  app.use("/graphql", expressMiddleware(gqlserver));

  app.listen(PORT, () => console.log(`server is riu ${PORT}`));
}

init();