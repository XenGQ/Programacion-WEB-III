const Producto = require("../models/producto");
const Categoria = require("../models/categoria");

exports.crearCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerCategorias = async (req, res) => {
  const categorias = await Categoria.findAll();
  res.json(categorias);
};

exports.obtenerCategoria = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id, {
    include: Producto
  });

  if (!categoria) {
    return res.status(404).json({ mensaje: "Categoria no encontrada" });
  }

  res.json(categoria);
};

exports.actualizarCategoria = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);

  if (!categoria) {
    return res.status(404).json({ mensaje: "Categoria no encontrada" });
  }

  await categoria.update(req.body);
  res.json(categoria);
};

exports.eliminarCategoria = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);

  if (!categoria) {
    return res.status(404).json({ mensaje: "Categoria no encontrada" });
  }

  await categoria.destroy();
  res.json({ mensaje: "Categoria eliminada" });
};