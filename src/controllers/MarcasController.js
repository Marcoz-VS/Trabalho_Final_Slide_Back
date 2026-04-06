import Marcas from "../models/Marcas.js";
import Produtos from "../models/Produtos.js";

const MarcasController = {
  getAll: async (req, res) => {
    try {
      const resultado = await Marcas.findAll();

      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await Marcas.findByPk(id);

      if (!resultado) {
        return res
          .status(404)
          .json({ success: false, message: "Marca não encontrada" });
      }

      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMarcasProducts: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await Marcas.findByPk(id, { include: "products" });

      if (!resultado) {
        return res
          .status(404)
          .json({ success: false, message: "Marca não encontrada" });
      }

      res.status(200).json({ success: true, data: resultado });
    } catch(error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { name, yearCreate, phoneNumber } = req.body;

      if (!name?.trim() || !yearCreate?.trim() || !phoneNumber?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Preencha todos os campos",
        });
      }

      const resultado = await Marcas.create({
        name,
        yearCreate,
        phoneNumber,
      });

      res.status(201).json({
        success: true,
        message: "marca criada com sucesso!",
        data: resultado,
      });
    } catch(error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, yearCreate, phoneNumber } = req.body;

      if (!name?.trim() || !yearCreate?.trim() || !phoneNumber?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Preencha todos os campos",
        });
      }

      const [atualizado] = await Marcas.update(
        { name, phoneNumber, yearCreate },
        { where: { id } },
      );

      if (!atualizado) {
        return res
          .status(404)
          .json({ success: false, message: "Marca não encontrada" });
      }

      res
        .status(200)
        .json({ success: true, message: "Marca atualizada com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletado = await Marcas.destroy({ where: { id } });

      if (!deletado) {
        return res
          .status(404)
          .json({ success: false, message: "Marca não encontrada" });
      }

      res
        .status(200)
        .json({ success: true, message: "Marca deletada com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default MarcasController;
