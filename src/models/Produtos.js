import { DataTypes } from "sequelize";
import { sequelize } from "../db/DB";
import Marcas from "./Marcas.js";

const Produtos = sequelize.define("Produtos", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    storage: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

Marcas.hasMany(Produtos, { foreignKey: 'marcaId' });
Produtos.belongsTo(Marcas, { foreignKey: 'marcaId' });

export default Produtos;
