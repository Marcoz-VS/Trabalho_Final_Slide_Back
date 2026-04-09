import Users from "../models/Usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";

const chaveSecreta = process.env.CHAVE_JWT;

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// No Login, é uma boa prática de segurança NÃO dizer se o que errou foi o e-mail ou a senha
const LoginController = {
  login: async (req, res) => {
    try {
      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Preencha os campos de login corretamente.",
          errors: error.details.map(detail => detail.message)
        });
      }

      const { email, password } = value;
      const resultado = await Users.findOne({ where: { email } });

      // Mensagem genérica para evitar "User Enumeration"
      if (!resultado || !(await bcrypt.compare(password, resultado.password))) {
        return res.status(401).json({
          success: false,
          message: "E-mail ou senha incorretos.",
        });
      }

      const token = jwt.sign(
        { id: resultado.id, email: resultado.email, role: resultado.role },
        chaveSecreta,
        { expiresIn: "2h" },
      );

      res.status(200).json({ success: true, message: "Login realizado com sucesso!", token });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erro ao tentar realizar login." });
    }
  },
};

export default LoginController;
