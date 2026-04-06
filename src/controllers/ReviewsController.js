import Reviews from '../models/Reviews.js'

const ReviewsController = {
    getAll: async (req,res) => {
    try{
     const resultado = await Reviews.findAll();

  if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Reviews não encontrados",
        });
      }

      res.status(200).json({
        success: true,
        data: resultado,
        message: "Reviews puxados com sucesso!"
    })} catch(error){
    res.status(500).json({ error: error.message });
    }
  },
  getById: async (req,res) => {
    try{
    const {id} = req.params
    const resultado = await Reviews.findByPk(id)

    if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Review não encontrado",
        });
      }

    res.status(200).json({
        success: true,
        message: "Review puxado com sucesso!",
        data: resultado,
      });

    } catch(error){
    res.status(500).json({ error: error.message });
    }
  },

    create: async (req, res) => {
    try {
      const userId = req.user.id
      const { rate, comments, produtoId } = req.body;

      const resultado = await Reviews.create({
      rate,
      comments,
      produtoId,
      userId
      });

        if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Não foi possivel criar Review",
        });
      }

      if  (!comments.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa comentar brevemente" });
      }

      res.status(201).json({
        success: true,
        message: "Review feito com sucesso!",
        data: resultado,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { rate, comments } = req.body;
      const [atualizado] = await Reviews.update(
        {
          rate,
          comments
        },
        {
          where: { id },
        },
      );

      if (!atualizado) {
        return res.status(404).json({ success: false, message: "Review não encontrado" });
      }

        if  (!comments.trim('')) {
        return res.status(400).json({ success: false, message: "você precisa fazer um novo comentário" });
      }

      res.status(200).json({
        success: true,
        message: "Reviews atualizados com sucesso!",
        data: atualizado
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    const {id} = req.params
    const deletado = await Reviews.destroy({
        where: {id}
    });

    if (!deletado) {
        return res.status(404).json({
          success: false,
          message: "Falha ao deletar Review",
        });
      }

        res.status(200).json({
        success: true,
        message: "Review deletado com sucesso!",
        data: deletado,
  })
 },

 getUsuarioByReview: async (req, res) => {
    try{ 
    const { id } = req.params;
    const resultado = await Reviews.findByPk(id, {include:{ association: 'usuario', attributes: {exclude: ["password"] }}});

       if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Falha ao encontrar a Usuario que fez a Review",
        });
      }

        res.status(200).json({
        success: true,
        data: resultado,
        message: "Usuario encontrado com sucesso!",
      });
    }catch(error){
    res.status(500).json({ error: error.message });
    }
 },

 getProdutoByReview: async (req, res) => {
    try{
    const { id } = req.params;
    const resultado = await Reviews.findByPk(id, {include: 'produto'});

       if (!resultado) {
        return res.status(404).json({
          success: false,
          message: "Falha ao encontrar a Produto da Review",
        });
      }

        res.status(200).json({
        success: true,
        data: resultado,
        message: "Produto acessado com sucesso!",
      });
    }catch(error){
    res.status(500).json({ error: error.message });
    }
 }
}

export default ReviewsController