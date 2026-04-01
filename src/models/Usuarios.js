import { DataTypes } from "sequelize";
import { sequelize } from "../db/DB";

const Users = sequelize.define("Users", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.ENUM('admin', 'client', 'mod'),
        allowNull: false,
        defaultValue: 'client'
    }
});

export default Users;
