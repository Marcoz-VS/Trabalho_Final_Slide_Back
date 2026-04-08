import Users from "../models/Usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";

const chaveSecreta = process.env.CHAVE_JWT;

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const LoginController = {
  login: async (req, res) => {
    try {
      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Dados de login inválidos",
          errors: error.details.map(detail => detail.message)
        });
      }

      const { email, password } = value;

      const resultado = await Users.findOne({ where: { email } });

      if (!resultado) {
        return res.status(401).json({
          success: false,
          message: "Credenciais inválidas",
        });
      }

      const hashCompare = await bcrypt.compare(password, resultado.password);

      if (!hashCompare) {
        return res.status(401).json({
          success: false,
          message: "Credenciais inválidas",
        });
      }

      const token = jwt.sign(
        { id: resultado.id, email: resultado.email, role: resultado.role },
        chaveSecreta,
        { expiresIn: "2h" },
      );

      res.status(200).json({ success: true, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default LoginController;
