import Users from "../models/Usuarios.js";
import bcrypt from 'bcrypt'

const RegisterController = {
   
   register: async (req, res) => {
    try {
      const { name, email, password, cpf, role } = req.body;

      const hash = await bcrypt.hash(password, 10)

      const resultado = await Users.create({
        name,
        email,
        cpf,
        password: hash,
        role: role || "user",
      });

      if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Não foi possivel criar o usuário",
        });
      }

        if  (!name.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa preencher todos os campos" });
      }
        if  (!password.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa preencher todos os campos" });
      }
        if  (!email.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa preencher todos os campos" });
      }
        if  (!cpf.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa preencher todos os campos" });
      }
      if (!role) {
        return res
          .status(400)
          .json({ success: false, message: "você precisa preencher o role" });
      }

      const roles = ["client", "admin", "mod"];

      if (!roles.includes(role)) {
        return res.status(400).json({
          message: "O role fornecido não é correta",
          data: null,
        });
      }

      res.status(201).json({
        message: "Usuario criado com sucesso!",
        data: resultado,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
}