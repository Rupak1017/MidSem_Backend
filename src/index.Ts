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
        playerStats: [PlayerStats!]!
    }
    type Mutation {
        createFootball(playerName: String!, age: String!, club: String!, position: String!): Boolean
        deleteFootball(id: String!): Boolean
        updateFootball(id: String!, playerName: String!): Boolean
        createPlayerStats(playerId: String!, goals: Int!, assists: Int!, yellowCards: Int!, redCards: Int!): Boolean
    }
    type Football {
      id: String!
      playerName: String!
      age: String!
      club: String!
      position: String!
      playerStats: [PlayerStats!]!
          
    }
    type PlayerStats {
      id: String!
      playerId: String!
      goals: Int!
      assists: Int!
      yellowCards: Int!
      redCards: Int!
    }
    `,
    resolvers: {
      Query: {
        hello: () => `Hey there`,
        football: async (_, { id }) => {
          try {
            const football = await prismaClient.football.findUnique({
              where: { id },
              include: { playerStats: true }
            });
            return football;
          } catch (error) {
            console.error('Error fetching football:', error);
            throw error;
          }
        },
        footballs: async () => {
          try {
            const footballs = await prismaClient.football.findMany(
              { include: { playerStats: true } }
            );
            return footballs;
          } catch (error) {
            console.error('Error fetching footballs:', error);
            throw error;
          }
        },
        playerStats: async () => {
          try {
            const playerStats = await prismaClient.playerStats.findMany();
            return playerStats;
          } catch (error) {
            console.error('Error fetching player stats:', error);
            throw error;
          }
        }
      },
      Mutation:{
        createFootball : async(_, 
          {playerName,
          age,
          club,
          position,
          
          }: {playerName: string
          age: string
          club: string
          position: string
          
          }) => {
            await prismaClient.football.create({
              data: {
                playerName
                ,age
                ,club
                ,position
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
          updateFootball: async (_, { id, playerName  }) => {  // Resolver for updating a football by ID
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
          },
          createPlayerStats: async (_, { playerId, goals, assists, yellowCards, redCards }) => {
            try {
              await prismaClient.playerStats.create({
                data: {
                  playerId,
                  goals,
                  assists,
                  yellowCards,
                  redCards
                }
              });
              return true;
            } catch (error) {
              console.error('Error creating player stats:', error);
              throw error;
            }
          }
      },
    },
  });

  await gqlserver.start();

  app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
  });
  app.use("/graphql", expressMiddleware(gqlserver));

  app.listen(PORT, () => console.log(`server is running at port ${PORT}`));
}

init();
