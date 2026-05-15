const express = require("express");
const router = express.Router();

const productoController = require("../controllers/controlador_producto");

router.post("/productos", productoController.crearProducto);

module.exports = router;