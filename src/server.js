import "dotenv/config";
import express, { json } from "express";
import { connect } from "./db/DB.js";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }),
);
app.use(json());

app.get("/", (req, res) => {
    res.json({message: "oi"})
})

app.listen(PORT, async () => {
  await connect();
  console.log(`Servidor rodando na porta ${PORT} http://localhost:${PORT}`);
});
