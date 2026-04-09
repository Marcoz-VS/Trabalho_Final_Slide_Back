import { DataTypes } from "sequelize";
import { sequelize } from "../db/DB.js";
import Usuarios from "./Usuarios.js";

const Carrinho = sequelize.define("Carrinho", {
    status: {
        type: DataTypes.ENUM('aberto', 'finalizado'),
        defaultValue: 'aberto'
    }
});

Usuarios.hasOne(Carrinho, { foreignKey: 'usuarioId' });
Carrinho.belongsTo(Usuarios, { foreignKey: 'usuarioId' });

export default Carrinho;
