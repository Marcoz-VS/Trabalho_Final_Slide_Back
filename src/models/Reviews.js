import { DataTypes } from "sequelize";
import { sequelize } from "../db/DB.js";
import Produtos from "./Produtos.js";
import Usuarios from "./Usuarios.js";

const Reviews = sequelize.define("Reviews", {
    comments: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    }
});

Produtos.hasMany(Reviews, { foreignKey: 'produtoId' , as: 'review', onDelete: 'CASCADE' });
Reviews.belongsTo(Produtos, { foreignKey: 'produtoId', as: 'produto' });

Usuarios.hasMany(Reviews, { foreignKey: 'userId', as: 'review', onDelete: 'CASCADE' });
Reviews.belongsTo(Usuarios, { foreignKey: 'userId', as: 'usuario' });

export default Reviews;
