import Carrinho from "../models/Carrinho.js";
import CarrinhoItem from "../models/CarrinhoItem.js";
import Produtos from "../models/Produtos.js";
import Joi from "joi";

const schema = Joi.object({
  produtoId: Joi.number().integer().required(),
  quantidade: Joi.number().integer().min(1).required(),
}).prefs({ convert: true });


const idSchema = Joi.object({
  id: Joi.number().integer().required(),
});

const CarrinhoController = {
  _getOrCreate: async (usuarioId) => {
    const [carrinho] = await Carrinho.findOrCreate({
      where: { usuarioId, status: "aberto" },
    });
    return carrinho;
  },

  exibir: async (req, res) => {
    try {
      const usuarioId = req.user.id;
      const resultado = await Carrinho.findOne({
        where: { usuarioId, status: "aberto" },
        include: {
          model: CarrinhoItem,
          as: "itens",
          include: [{ model: Produtos, as: "produto" }],
        },
      });

      if (!resultado || !resultado.itens || resultado.itens.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Carrinho vazio",
          data: { itens: [], subtotal: "0.00" },
        });
      }

      let subtotal = 0;
      const itensFormatados = resultado.itens.map((item) => {
        const totalItem = item.quantidade * item.produto.price;
        subtotal += totalItem;
        return {
          id: item.id,
          produtoId: item.produto.id,
          nome: item.produto.name,
          quantidade: item.quantidade,
          precoUnitario: item.produto.price,
          totalItem: totalItem.toFixed(2),
        };
      });

      res.status(200).json({
        success: true,
        data: {
          itens: itensFormatados,
          subtotal: subtotal.toFixed(2),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  addItem: async (req, res) => {
    try {
      const { error, value } = schema.validate(req.body);
      
      if (error)
        return res
          .status(400)
          .json({ success: false, message: error.details[0].message });

      const { produtoId, quantidade } = value;
      const usuarioId = req.user.id;

      const produto = await Produtos.findByPk(produtoId);
      if (!produto)
        return res
          .status(404)
          .json({ success: false, message: "Produto não encontrado" });

      const carrinho = await CarrinhoController._getOrCreate(usuarioId);

      let item = await CarrinhoItem.findOne({
        where: { carrinhoId: carrinho.id, produtoId },
      });

      if (item) {
        const novaQuantidade = item.quantidade + quantidade;
        if (produto.storage < novaQuantidade) {
          return res
            .status(400)
            .json({ success: false, message: "Estoque insuficiente" });
        }
        await item.update({ quantidade: novaQuantidade });
      } else {
        if (produto.storage < quantidade) {
          return res
            .status(400)
            .json({ success: false, message: "Estoque insuficiente" });
        }
        item = await CarrinhoItem.create({
          carrinhoId: carrinho.id,
          produtoId,
          quantidade,
        });
      }

      res
        .status(201)
        .json({ success: true, message: "Item adicionado!", data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateQuantidade: async (req, res) => {
    try {
      const { error: idErr } = idSchema.validate({ id: Number(req.params.id) });
      const { error, value } = schema.validate(req.body);
      if (idErr || error)
        return res
          .status(400)
          .json({ success: false, message: "Dados inválidos" });

      const item = await CarrinhoItem.findByPk(req.params.id, {
        include: [{ model: Produtos, as: "produto" }],
      });

      if (!item)
        return res
          .status(404)
          .json({ success: false, message: "Item não encontrado" });

      if (item.produto.storage < value.quantidade) {
        return res
          .status(400)
          .json({ success: false, message: "Estoque insuficiente" });
      }

      await item.update({ quantidade: value.quantidade });
      res
        .status(200)
        .json({ success: true, message: "Quantidade atualizada!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error)
        return res.status(400).json({ success: false, message: "ID inválido" });

      const deletado = await CarrinhoItem.destroy({
        where: { id: req.params.id },
      });
      if (!deletado)
        return res
          .status(404)
          .json({ success: false, message: "Item não encontrado" });

      res.status(200).json({ success: true, message: "Item removido!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  limpar: async (req, res) => {
    try {
      const carrinho = await Carrinho.findOne({
        where: { usuarioId: req.user.id, status: "aberto" },
      });
      if (carrinho) {
        await CarrinhoItem.destroy({ where: { carrinhoId: carrinho.id } });
      }
      res.status(200).json({ success: true, message: "Carrinho esvaziado!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default CarrinhoController;
