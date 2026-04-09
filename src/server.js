import "dotenv/config";
import express, { json } from "express";
import { connect } from "./db/DB.js";
import cors from "cors";
import LoginRouter from "./routes/LoginRoutes.js";
import RegisterRouter from "./routes/RegisterRoutes.js";
import UsuariosRouter from "./routes/UsuariosRoutes.js";
import MarcasRouter from "./routes/MarcasRoutes.js"
import ReviewsRouter from "./routes/ReviewsRoutes.js";
import ProdutosRouter from "./routes/ProdutosRoutes.js";
import CarrinhoRouter from "./routes/CarrinhoRoutes.js";

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

app.use("/login", LoginRouter);

app.use("/register", RegisterRouter);

app.use("/usuarios", UsuariosRouter);

app.use("/marcas", MarcasRouter);

app.use("/reviews", ReviewsRouter)

app.use("/products", ProdutosRouter)

app.use("/carrinho", CarrinhoRouter);

app.listen(PORT, async () => {
  await connect();
  console.log(`Servidor rodando na porta ${PORT} http://localhost:${PORT}`);
});
