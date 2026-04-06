import Produtos from "../models/Produtos.js";
import { Op } from 'sequelize'

const productController = {
  getAll: async (req, res) => {
    try {

      const {marca, minPrice, maxPrice, order} = req.query;
      const where = {};
      
      if (marca) where.marcaId = marca;

      if (minPrice || maxPrice) {
       where.price = {};
       if (minPrice) where.price[Op.gte] = Number(minPrice);
       if (maxPrice) where.price[Op.lte] = Number(maxPrice);
      }

      console.log(where)

      const resultado = await Produtos.findAll({
        where,
        order: [["price", order === "desc" ? "DESC" : "ASC"]]
      });

            if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Produto não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Produtos puxados com sucesso com sucesso!",
        data: resultado,
      });

    } catch (error) {
      res.status(500).json({ error: error.message });

    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await Produtos.findByPk(id);

        if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Produto não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Produto puxado com sucesso!",
        data: resultado,
      });

    } catch (error) {
      res.status(500).json({ error: error.message });

    }
  },

  create: async (req, res) => {
    try {
      const { name, price, storage, marcaId } = req.body;

      const resultado = await Product.create({
        name,
        price,
        marcaId,
        storage
      });

        if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Produto não encontrado",
        });
      }

      if  (!name.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa preencher todos os campos" });
      }

      res.status(201).json({
        success: true,
        message: "Produtos criados com sucesso!",
        data: resultado,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, storage, marcaId } = req.body;
      const [atualizado] = await Produtos.update(
        {
          name,
          price,
          marcaId,
          storage
        },
        {
          where: { id },
        },
      );

      if (!atualizado) {
        return res.status(404).json({ success: false, message: "Produto não encontrado" });
      }

        if  (!name.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa preencher todos os campos" });
      }

      res.status(200).json({
        success: true,
        message: "Produtos atualizados com sucesso!",
        data: atualizado
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletado = await Produtos.destroy({ where: { id } });

      if (!deletado) {
        return res.status(404).json({
          success: false,
          message: "Produto não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Produto deletado com sucesso!",
        data: deletado,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMarcaProduct: async (req, res) => {
    try{
    const { id } = req.params;
    const resultado = await Produtos.findByPk(id, {include: 'marca'});

       if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Falha ao encontrar a marca do Produto",
        });
      }

        res.status(200).json({
        success: true,
        data: resultado,
        message: "Marca do produto puxada com sucesso!",
      });
  
    } catch(error){
      res.status(500).json({ error: error.message });
    }
  },

  getProductsReview: async (req, res) => {
    try{
    const { id } = req.params;
    const resultado = await Produtos.findByPk(id, {include: 'reviews'});

       if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Falha ao encontrar Reviews do Produto",
        });
      }

        res.status(200).json({
        success: true,
        data: resultado,
        message: "Reviews do produto puxado com sucesso!",
      });
    }catch(error){
      res.status(500).json({ error: error.message });
    }
  }
};

export default productController;