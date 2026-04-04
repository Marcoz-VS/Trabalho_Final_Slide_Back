import Users from "../models/Usuarios.js";

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
      const { id } = req.params;
      const resultado = await Users.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!resultado) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }

      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, cpf, password } = req.body;

      if (
        !name?.trim() ||
        !email?.trim() ||
        !cpf?.trim() ||
        !password?.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Preencha todos os campos",
        });
      }

      const hash = await bcrypt.hash(password, 10);

      const [atualizado] = await Users.update(
        { name, email, cpf, password: hash },
        { where: { id } },
      );

      if (!atualizado) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }

      res
        .status(200)
        .json({ success: true, message: "Usuário atualizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletado = await Users.destroy({ where: { id } });

      if (!deletado) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }

      res
        .status(200)
        .json({ success: true, message: "Usuário deletado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default UsuariosController;
