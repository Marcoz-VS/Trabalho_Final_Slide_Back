import Users from "../models/Usuarios.js";
import bcrypt from "bcrypt";
import Joi from "joi";

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .allow("")
    .optional(),
  cpf: Joi.string()
    .pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)
    .optional(),
  role: Joi.string().valid("client", "admin", "mod").optional(),
}).min(1);

const idSchema = Joi.object({
  id: Joi.number().integer().required()
});

const UsuariosController = {
  getAll: async (req, res) => {
    try {
      const resultado = await Users.findAll({
        attributes: { exclude: ["password"] },
      });
      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erro ao listar usuários.", error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: error.details[0].message });

      const { id } = req.params;
      const resultado = await Users.findByPk(id, { attributes: { exclude: ["password"] } });

      if (!resultado) return res.status(404).json({ success: false, message: "Usuário não encontrado." });

      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erro ao buscar usuário." });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      
      const { error, value } = updateSchema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          success: false,
          errors: error.details.map((d) => d.message),
        });
      }

      const usuarioExistente = await Users.findByPk(id);
      if (!usuarioExistente) {
        return res.status(404).json({ success: false, message: "Usuário não encontrado." });
      }

      const dadosAtualizados = { ...value };
      
      if (value.password && value.password.trim() !== "") {
        dadosAtualizados.password = await bcrypt.hash(value.password, 10);
      } else {
        delete dadosAtualizados.password;
      }

      await Users.update(dadosAtualizados, { where: { id } });

      res.status(200).json({ success: true, message: "Perfil atualizado com sucesso!" });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ success: false, message: "E-mail ou CPF já cadastrado." });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido." });

      const { id } = req.params;
      const deletado = await Users.destroy({ where: { id } });

      if (!deletado) return res.status(404).json({ success: false, message: "Usuário não encontrado." });

      res.status(200).json({ success: true, message: "Usuário removido com sucesso!" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erro ao excluir usuário." });
    }
  },

  getUsuariosReviews: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido." });

      const { id } = req.params;
      const resultado = await Users.findByPk(id, {
        include: { association: "review" },
        attributes: { exclude: ["password"] },
      });

      if (!resultado) return res.status(404).json({ success: false, message: "Usuário não encontrado." });

      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erro ao buscar avaliações." });
    }
  },
};

export default UsuariosController;
