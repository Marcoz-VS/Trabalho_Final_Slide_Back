import { DataTypes } from "sequelize";
import { sequelize } from "../db/DB.js";

const Marcas = sequelize.define("Marcas", {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    yearCreate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
    },
})

export default Marcas;