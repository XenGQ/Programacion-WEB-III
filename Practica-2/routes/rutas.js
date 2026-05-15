const express = require("express");
const router = express.Router();

const controller = require("../controllers/controlador");

router.post("/categorias", controller.crearCategoria);
router.get("/categorias", controller.obtenerCategorias);
router.get("/categorias/:id", controller.obtenerCategoria);
router.patch("/categorias/:id", controller.actualizarCategoria);
router.delete("/categorias/:id", controller.eliminarCategoria);

module.exports = router;