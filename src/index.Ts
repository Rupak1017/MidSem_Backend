import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";


app.get("/", (req, res) => {
    res.json({ message: "seevering" });
  });
 const gsqlserver=new ApolloServer();
  app.use("/graphql", expressMiddleware(gqlserver));

  app.listen(PORT, () => console.log(`server is running on ${PORT}`));
