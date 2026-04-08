import Marcas from "../models/Marcas.js";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(2).max(255).trim().required(),
  yearCreate: Joi.date().iso().required(),
  phoneNumber: Joi.string().min(8).trim().required()
});

const idSchema = Joi.object({
  id: Joi.number().integer().required()
});

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
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido" });

      const resultado = await Marcas.findByPk(req.params.id);
      if (!resultado) return res.status(404).json({ success: false, message: "Marca não encontrada" });

      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMarcasProducts: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido" });

      const resultado = await Marcas.findByPk(req.params.id, { include: "produtos" });
      if (!resultado) return res.status(404).json({ success: false, message: "Marca não encontrada" });

      res.status(200).json({ success: true, data: resultado });
    } catch(error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { error, value } = schema.validate(req.body);
      if (error) return res.status(400).json({ success: false, message: error.details[0].message });

      const resultado = await Marcas.create(value);
      res.status(201).json({ success: true, message: "Marca criada!", data: resultado });
    } catch(error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { error: idErr } = idSchema.validate(req.params);
      const { error, value } = schema.validate(req.body);
      if (idErr || error) return res.status(400).json({ success: false, message: "Dados inválidos" });

      const [atualizado] = await Marcas.update(value, { where: { id: req.params.id } });
      if (!atualizado) return res.status(404).json({ success: false, message: "Marca não encontrada" });

      res.status(200).json({ success: true, message: "Marca atualizada!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido" });

      const deletado = await Marcas.destroy({ where: { id: req.params.id } });
      if (!deletado) return res.status(404).json({ success: false, message: "Marca não encontrada" });

      res.status(200).json({ success: true, message: "Marca deletada!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default MarcasController;
