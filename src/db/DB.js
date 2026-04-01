import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: 3306,
  },
);

async function connect() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Conexão SQL estabelecida com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar no SQL:", error);
  }
}

export { sequelize, connect };
