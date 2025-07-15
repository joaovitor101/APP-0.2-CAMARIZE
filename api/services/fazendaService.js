import Sitio from "../models/Sitios.js";

class fazendaService {
  // Listar todas as fazendas
  async getAll() {
    try {
      const Sitios = await Sitio.find();
      return Sitios;
    } catch (error) {
      console.log(error);
    }
  }

  
  // Cadastrar fazenda
  async Create(nome, rua, bairro, cidade, numero) {
    try {
      const newSitio = new Sitio({
        nome,
        rua,
        bairro,
        cidade,
        numero
      });
      const saved = await newSitio.save();
      return saved;
    } catch (error) {
      console.log("Erro ao salvar no banco:", error);
      return null; // 👈 importante
    }
  }

  

  // Deletar fazenda
  async Delete(id) {
    try {
      await Sitio.findByIdAndDelete(id);
      console.log(`Fazenda com a id: ${id} foi excluída.`);
    } catch (error) {
      console.log(error);
    }
  }

  // Alterar fazenda
  async Update(id, nome, rua, bairro, cidade, numero) {
    try {
      await Sitio.findByIdAndUpdate(id, {
        nome,
        rua,
        bairro,
        cidade,
        numero
      });
      console.log(`Dados da fazenda com a id: ${id} alterados com sucesso.`);
    } catch (error) {
      console.log(error);
    }
  }

  // Listar uma única fazenda
  async getOne(id) {
    try {
      const sitio = await Sitio.findOne({ _id: id });
      return sitio;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new fazendaService(); 