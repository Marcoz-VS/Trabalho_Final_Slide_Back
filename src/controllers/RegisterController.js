import Users from "../models/Usuarios";
import bcrypt from "bcrypt";

const RegisterController = {
  register: async (req, res) => {
    try {
      const { name, email, password, cpf } = req.body;

      if (
        !name?.trim() ||
        !email?.trim() ||
        !password?.trim() ||
        !cpf?.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Preencha todos os campos",
        });
      }

      const hash = await bcrypt.hash(password, 10);

      const resultado = await Users.create({
        name,
        email,
        cpf,
        password: hash,
        role: "client",
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
