import Reviews from '../models/Reviews.js';
import Joi from "joi";

const schema = Joi.object({
  rate: Joi.number().min(1).max(5).required(),
  comments: Joi.string().min(5).max(500).trim().required(),
  produtoId: Joi.number().integer(),
});

const idSchema = Joi.object({
  id: Joi.number().integer().required()
});

const ReviewsController = {
  getAll: async (req, res) => {
    try {
      const resultado = await Reviews.findAll();
      res.status(200).json({
        success: true,
        data: resultado,
        message: "Reviews puxados com sucesso!"
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido" });

      const { id } = req.params;
      const resultado = await Reviews.findByPk(id);

      if (!resultado) {
        return res.status(404).json({ success: false, message: "Review não encontrado" });
      }

      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const userId = req.user.id;
      const { rate, comments, produtoId } = value;

      const resultado = await Reviews.create({
        rate,
        comments,
        produtoId,
        userId
      });

      res.status(201).json({
        success: true,
        message: "Review feito com sucesso!",
        data: resultado,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { error: idErr } = idSchema.validate(req.params);
      const { error, value } = schema.validate(req.body);
      
      if (idErr || error) {
        return res.status(400).json({ success: false, message: "Dados inválidos" });
      }

      const { id } = req.params;
      const { rate, comments } = value;

      const [atualizado] = await Reviews.update(
        { rate, comments },
        { where: { id } }
      );

      if (!atualizado) {
        return res.status(404).json({ success: false, message: "Review não encontrado" });
      }

      res.status(200).json({ success: true, message: "Review atualizado!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido" });

      const { id } = req.params;
      const deletado = await Reviews.destroy({ where: { id } });

      if (!deletado) {
        return res.status(404).json({ success: false, message: "Review não encontrado" });
      }

      res.status(200).json({ success: true, message: "Deletado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUsuarioByReview: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await Reviews.findByPk(id, {
        include: { association: 'usuario', attributes: { exclude: ["password"] } }
      });
      if (!resultado) return res.status(404).json({ success: false, message: "Não encontrado" });
      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProdutoByReview: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await Reviews.findByPk(id, { include: 'produto' });
      if (!resultado) return res.status(404).json({ success: false, message: "Não encontrado" });
      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default ReviewsController;
