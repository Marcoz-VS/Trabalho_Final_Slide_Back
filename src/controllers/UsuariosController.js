import Users from "../models/Usuarios.js";
import bcrypt from "bcrypt";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'O nome deve ter pelo menos 3 caracteres.',
    'any.required': 'O campo nome é obrigatório.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Informe um e-mail válido.',
    'any.required': 'O e-mail é obrigatório.'
  }),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required().messages({
    'string.pattern.base': 'A senha deve ter entre 3 e 30 caracteres (apenas letras e números).'
  }),
  cpf: Joi.string().pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/).required().messages({
    'string.pattern.base': 'O CPF informado está em um formato inválido.'
  }),
  role: Joi.string().valid('client', 'admin', 'mod').messages({
    'any.only': 'O cargo (role) deve ser: client, admin ou mod.'
  })
});

const idSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    'number.base': 'O ID enviado deve ser um número.',
    'any.required': 'O ID é obrigatório para esta operação.'
  })
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

      if (!resultado) {
        return res.status(404).json({ success: false, message: `Usuário com ID ${id} não foi encontrado.` });
      }

      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erro ao buscar usuário." });
    }
  },

  update: async (req, res) => {
    try {
      const { error: idError } = idSchema.validate(req.params);
      if (idError) return res.status(400).json({ success: false, message: idError.details[0].message });

      const { error, value } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Existem erros de validação nos dados enviados.",
          errors: error.details.map(d => d.message)
        });
      }

      const { id } = req.params;
      const { name, email, cpf, password, role } = value;
      const hash = await bcrypt.hash(password, 10);

      const [atualizado] = await Users.update(
        { name, email, cpf, password: hash, role },
        { where: { id } },
      );

      if (atualizado === 0) {
        return res.status(404).json({ success: false, message: "Usuário não encontrado para atualização." });
      }

      res.status(200).json({ success: true, message: "Usuário atualizado com sucesso!" });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ success: false, message: "Este e-mail ou CPF já está sendo usado por outro usuário." });
      }
      res.status(500).json({ success: false, message: "Erro interno ao atualizar usuário." });
    }
  },

  delete: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido." });

      const { id } = req.params;
      const deletado = await Users.destroy({ where: { id } });

      if (!deletado) {
        return res.status(404).json({ success: false, message: "Não foi possível excluir: usuário não encontrado." });
      }

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
        include: { association: 'review' }, 
        attributes: { exclude: ["password"] }
      });

      if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado para carregar as avaliações.",
        });
      }

      res.status(200).json({
        success: true,
        data: resultado,
        message: "Avaliações carregadas com sucesso!",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erro ao buscar avaliações do usuário." });
    }
  }
};

export default UsuariosController;
