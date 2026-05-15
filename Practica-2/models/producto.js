const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define("productos", {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Producto;