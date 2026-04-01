import Usuario from "../models/Usuario.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const chaveSecreta = process.env.CHAVE_JWT

const LoginController = {

    login: async (req, res) => {
        try {
      const { email, password } = req.body;
      const resultado = await Usuario.findOne({where: { email }});

      if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Usuario não encontrado",
        });
      }

    const hashCompare = await bcrypt.compare(password, resultado.password)

    if(!hashCompare){
        return res.status(401).json({
          success: false,
          message: "A senha fornecida não é correta!",
        });
      }

    const token = jwt.sign({id: resultado.id, email: resultado.email, role: resultado.role}, chaveSecreta, {expiresIn: '1h'});

      res.status(200).json({
        success: true,
        message: "Você fez o Login!",
        token: token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

    },
}

export default LoginController;