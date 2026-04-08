import Users from "../models/Usuarios.js";
import bcrypt from "bcrypt";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
  cpf: Joi.string().pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/).required(),
  role: Joi.string().valid('client', 'admin', 'mod')
});

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
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido" });

      const { id } = req.params;
      const resultado = await Users.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!resultado) {
        return res.status(404).json({ success: false, message: "Usuário não encontrado" });
      }

      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { error: idError } = idSchema.validate(req.params);
      if (idError) return res.status(400).json({ success: false, message: "ID inválido" });

      const { error, value } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          success: false,
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

      if (!atualizado) {
        return res.status(404).json({ success: false, message: "Usuário não encontrado" });
      }

      res.status(200).json({ success: true, message: "Usuário atualizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido" });

      const { id } = req.params;
      const deletado = await Users.destroy({ where: { id } });

      if (!deletado) {
        return res.status(404).json({ success: false, message: "Usuário não encontrado" });
      }

      res.status(200).json({ success: true, message: "Usuário deletado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUsuariosReviews: async (req, res) => { 
    try {
      const { error } = idSchema.validate(req.params);
      if (error) return res.status(400).json({ success: false, message: "ID inválido" });

      const { id } = req.params;
      const resultado = await Users.findByPk(id, {
        include: { association: 'review' }, 
        attributes: { exclude: ["password"] }
      });

      if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Falha ao encontrar as Reviews do Usuario",
        });
      }

      res.status(200).json({
        success: true,
        data: resultado,
        message: "Reviews do Usuario acessado com sucesso!",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default UsuariosController;
