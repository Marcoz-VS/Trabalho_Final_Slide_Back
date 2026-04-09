import { DataTypes } from "sequelize";
import { sequelize } from "../db/DB.js";
import Carrinho from "./Carrinho.js";
import Produtos from "./Produtos.js";

const CarrinhoItem = sequelize.define("CarrinhoItem", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1 }
    }
});

Carrinho.belongsToMany(Produtos, { through: CarrinhoItem, foreignKey: 'carrinhoId' });
Produtos.belongsToMany(Carrinho, { through: CarrinhoItem, foreignKey: 'produtoId' });

Carrinho.hasMany(CarrinhoItem, { foreignKey: 'carrinhoId', as: 'itens' });
CarrinhoItem.belongsTo(Carrinho, { foreignKey: 'carrinhoId' });
CarrinhoItem.belongsTo(Produtos, { foreignKey: 'produtoId', as: 'produto' });

export default CarrinhoItem;
