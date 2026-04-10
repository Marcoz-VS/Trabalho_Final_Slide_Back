import Produtos from "../models/Produtos.js";
import { Op } from 'sequelize';
import Joi from "joi";
import Marcas from '../models/Marcas.js'

const schema = Joi.object({
  name: Joi.string().min(2).max(255).trim().required(),
  price: Joi.number().positive().required(),
  storage: Joi.number().integer().min(0).default(0),
  marcaId: Joi.number().integer().required()
});

const querySchema = Joi.object({
  marca: Joi.number().integer(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  order: Joi.string().valid('asc', 'desc').default('asc')
});

const idSchema = Joi.object({
  id: Joi.number().integer().required()
});

const productController = {
  getAll: async (req, res) => {
    try {
      const { error, value } = querySchema.validate(req.query);
      if (error) return res.status(400).json({ success: false, message: "Filtros inválidos" });

      const { marca, minPrice, maxPrice, order } = value;
      const where = {};
      
      if (marca) where.marcaId = marca;
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = minPrice;
        if (maxPrice) where.price[Op.lte] = maxPrice;
      }

      const resultado = await Produtos.findAll({
        where,
        include: {
        model: Marcas,
        as: "marca"
  },
        order: [["price", order.toUpperCase()]]
      });

      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

getById: async (req, res) => {
  try {
    const { error } = idSchema.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }

    const resultado = await Produtos.findByPk(req.params.id, {
      include: [
        {
          association: "marca"
        },
        {
          association: "review",
          include: [
            {
              association: "usuario",
              attributes: ["id", "name"]
            }
          ]
        }
      ]
    });

    if (!resultado) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado"
      });
    }

    res.status(200).json({
      success: true,
      data: resultado
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
},

  create: async (req, res) => {
    try {
      const { error, value } = schema.validate(req.body);
      if (error) return res.status(400).json({ success: false, message: error.details[0].message });

      const resultado = await Produtos.create(value);
      res.status(201).json({ success: true, message: "Produto criado!", data: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { error: idErr } = idSchema.validate(req.params);
      const { error, value } = schema.validate(req.body);
      if (idErr || error) return res.status(400).json({ success: false, message: "Dados inválidos" });

      const [atualizado] = await Produtos.update(value, { where: { id: req.params.id } });
      if (!atualizado) return res.status(404).json({ success: false, message: "Produto não encontrado" });

      res.status(200).json({ success: true, message: "Produto atualizado!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido" });

      const deletado = await Produtos.destroy({ where: { id: req.params.id } });
      if (!deletado) return res.status(404).json({ success: false, message: "Produto não encontrado" });

      res.status(200).json({ success: true, message: "Produto deletado!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMarcaProduct: async (req, res) => {
    try {
      const resultado = await Produtos.findByPk(req.params.id, { include: 'marca' });
      if (!resultado) return res.status(404).json({ success: false, message: "Não encontrado" });
      res.status(200).json({ success: true, data: resultado });
    } catch(error){
      res.status(500).json({ error: error.message });
    }
  },

  getProductsReview: async (req, res) => {
    try {
      const resultado = await Produtos.findByPk(req.params.id, { include: 'review' });
      if (!resultado) return res.status(404).json({ success: false, message: "Não encontrado" });
      res.status(200).json({ success: true, data: resultado });
    } catch(error){
      res.status(500).json({ error: error.message });
    }
  }
};

export default productController;
