"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const db_1 = require("./lib/db");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const PORT = Number(process.env.PORT) || 3000;
        app.use(express_1.default.json());
        const gqlserver = new server_1.ApolloServer({
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
      playerId: String!     
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
                    football: (_1, _a) => __awaiter(this, [_1, _a], void 0, function* (_, { id }) {
                        try {
                            const football = yield db_1.prismaClient.football.findUnique({
                                where: { id },
                                include: { playerStats: true }
                            });
                            return football;
                        }
                        catch (error) {
                            console.error('Error fetching football:', error);
                            throw error;
                        }
                    }),
                    footballs: () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const footballs = yield db_1.prismaClient.football.findMany({ include: { playerStats: true } });
                            return footballs;
                        }
                        catch (error) {
                            console.error('Error fetching footballs:', error);
                            throw error;
                        }
                    }),
                    playerStats: () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const playerStats = yield db_1.prismaClient.playerStats.findMany();
                            return playerStats;
                        }
                        catch (error) {
                            console.error('Error fetching player stats:', error);
                            throw error;
                        }
                    })
                },
                Mutation: {
                    createFootball: (_2, _b) => __awaiter(this, [_2, _b], void 0, function* (_, { playerName, age, club, position, }) {
                        yield db_1.prismaClient.football.create({
                            data: {
                                playerName,
                                age,
                                club,
                                position
                            },
                        });
                        return true;
                    }),
                    deleteFootball: (_3, _c) => __awaiter(this, [_3, _c], void 0, function* (_, { id }) {
                        try {
                            yield db_1.prismaClient.football.delete({
                                where: { id }
                            });
                            return true;
                        }
                        catch (error) {
                            console.error('Error deleting football:', error);
                            throw error;
                        }
                    }),
                    updateFootball: (_4, _d) => __awaiter(this, [_4, _d], void 0, function* (_, { id, playerName }) {
                        try {
                            yield db_1.prismaClient.football.update({
                                where: { id },
                                data: {
                                    playerName
                                }
                            });
                            return true;
                        }
                        catch (error) {
                            console.error('Error updating football:', error);
                            throw error;
                        }
                    }),
                    createPlayerStats: (_5, _e) => __awaiter(this, [_5, _e], void 0, function* (_, { playerId, goals, assists, yellowCards, redCards }) {
                        try {
                            yield db_1.prismaClient.playerStats.create({
                                data: {
                                    playerId,
                                    goals,
                                    assists,
                                    yellowCards,
                                    redCards
                                }
                            });
                            return true;
                        }
                        catch (error) {
                            console.error('Error creating player stats:', error);
                            throw error;
                        }
                    })
                },
            },
        });
        yield gqlserver.start();
        app.get("/", (req, res) => {
            res.json({ message: "Hello World" });
        });
        app.use("/graphql", (0, express4_1.expressMiddleware)(gqlserver));
        app.listen(PORT, () => console.log(`server is running at port ${PORT}`));
    });
}
init();
