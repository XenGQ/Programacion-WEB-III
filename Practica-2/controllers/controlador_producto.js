const Producto = require("../models/producto");

exports.crearProducto = async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};