import Users from "../models/Usuarios.js";
import bcrypt from "bcrypt";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
  cpf: Joi.string().pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/).required(),
  role: Joi.string().valid('client', 'admin', 'mod').default('client')
})

const RegisterController = {
  register: async (req, res) => {
    try {
      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors: error.details.map(detail => detail.message)
        });
      }

      const { name, email, password, cpf, role } = value;

      const hash = await bcrypt.hash(password, 10);

      const resultado = await Users.create({
        name,
        email,
        cpf,
        password: hash,
        role
      });

      const { password: _, ...usuarioSemSenha } = resultado.toJSON();

      res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso!",
        data: usuarioSemSenha,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default RegisterController;
