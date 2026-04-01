import Users from "../models/Usuarios.js";
import bcrypt from 'bcrypt'

const UsuariosController = {

    getAll: async (req, res) => {
        try {
      const resultado = await Users.findAll();

      if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Usuario não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: resultado,
        message: "Usuarios puxados com sucesso!",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

    },

    getById: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await Users.findByPk(id);

      if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Usuario não encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: resultado,
        message: "Usuario puxado com sucesso!",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
    update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, password, email, cpf } = req.body;

      const hash = await bcrypt.hash(password, 10)

      const [atualizado] = await Users.update(
        { name, email, cpf, password: hash },
        { where: { id }},
      );

      if (!atualizado) {
        return res.status(404).json({ message: "Usuario não encontrado" });
      }

        if  (!name.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa preencher todos os campos" });
      }

        if  (!email.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa preencher todos os campos" });
      }

        if  (!cpf.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa preencher todos os campos" });
      }
      
        if  (!password.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa preencher todos os campos" });
      }

      res.status(200).json({
        success: true,
        data: atualizado,
        message: "Usuario atualizado com sucesso!",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

   delete: async (req, res) => {
    try {
      const { id } = req.params;

      const deletado = await Usuario.destroy({ where: { id } });

      if (!deletado) {
        return res.status(404).json({
          success: false,
          message: "Usuario não encontrado",
        });
      }

      res.status(200).json({
        message: "Usuario deletado com sucesso!",
        data: deletado,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
}

export default UsuariosController