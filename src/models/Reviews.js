import { DataTypes } from "sequelize";
import { sequelize } from "../db/DB.js";
import Produtos from "./Produtos.js";
import Users from "./Users.js";

const Reviews = sequelize.define("Reviews", {
    comments: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    }
});

Produtos.hasMany(Reviews, { foreignKey: 'produtoId', onDelete: 'CASCADE' });
Reviews.belongsTo(Produtos, { foreignKey: 'produtoId' });

Users.hasMany(Reviews, { foreignKey: 'userId', onDelete: 'CASCADE' });
Reviews.belongsTo(Users, { foreignKey: 'userId' });

export default Reviews;
