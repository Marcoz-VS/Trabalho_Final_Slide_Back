import Users from "../models/Usuarios.js";
import bcrypt from "bcrypt";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.min": "O nome deve ter pelo menos 3 caracteres.",
    "any.required": "O nome é obrigatório.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Informe um e-mail válido.",
    "any.required": "O e-mail é obrigatório.",
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required()
    .messages({
      "string.pattern.base":
        "A senha deve conter entre 3 e 30 caracteres alfanuméricos.",
    }),
  cpf: Joi.string()
    .pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "CPF em formato inválido.",
    }),
  role: Joi.string().valid("client", "admin", "mod").default("client"),
});

const RegisterController = {
  register: async (req, res) => {
    try {
      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors: error.details.map((detail) => detail.message),
        });
      }

      const { name, email, password, cpf, role } = value;

      const hash = await bcrypt.hash(password, 10);

      const resultado = await Users.create({
        name,
        email,
        cpf,
        password: hash,
        role,
      });

      const { password: _, ...usuarioSemSenha } = resultado.toJSON();

      res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso!",
        data: usuarioSemSenha,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          success: false,
          message: "E-mail ou CPF já cadastrado no sistema.",
        });
      }
      res
        .status(500)
        .json({
          success: false,
          message: "Erro interno ao processar o cadastro.",
        });
    }
  },
};

export default RegisterController;
