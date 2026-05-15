const express = require("express");
const sequelize = require("./config/database");

const categoriaRoutes = require("./routes/rutas");
const productoRoutes = require("./routes/ruta_producto");

const Categoria = require("./models/categoria");
const Producto = require("./models/producto");

const app = express();

app.use(express.json());

Categoria.hasMany(Producto, { foreignKey: "categoriaId" });
Producto.belongsTo(Categoria, { foreignKey: "categoriaId" });

app.use("/api", productoRoutes);
app.use("/api", categoriaRoutes);

sequelize.sync().then(() => {
  console.log("Base de datos conectada");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});