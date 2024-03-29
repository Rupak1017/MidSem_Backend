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
        footballs: [Football!]!
        football(id: String!): Football
    }
    type Mutation {
        createFootball(playerName: String): Boolean
        deleteFootball(id: String!): Boolean
        updateFootball(id: String!, playerName: String!): Boolean
       
    }
    type Football {
      id: String!
      playerName: String!
    }

    `,
    resolvers: {
      Query: {
        hello: () => `Hey there`,
        football: async (_, { id }) => {
          try {
            const football = await prismaClient.football.findUnique({
              where: { id }
            });
            return football;
          } catch (error) {
            console.error('Error fetching football:', error);
            throw error;
          }
        },
        footballs: async () => {
          try {
            const footballs = await prismaClient.football.findMany();
            return footballs;
          } catch (error) {
            console.error('Error fetching footballs:', error);
            throw error;
          }
        }
      },
      Mutation:{
        createFootball : async(_, 
          {playerName}: {playerName: string}) => {
            await prismaClient.football.create({
              data: {
                playerName
              },
            });
            return true;
          },
          deleteFootball: async (_, { id }) => {
            try {
              await prismaClient.football.delete({
                where: { id }
              });
              return true;
            } catch (error) {
              console.error('Error deleting football:', error);
              throw error;
            }
          },
          updateFootball: async (_, { id, playerName }) => {  // Resolver for updating a football by ID
            try {
              await prismaClient.football.update({
                where: { id },
                data: {
                  playerName
                }
              });
              return true;
            } catch (error) {
              console.error('Error updating football:', error);
              throw error;
            }
          }
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