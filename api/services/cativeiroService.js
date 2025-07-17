import Cativeiros from "../models/Cativeiros.js";

class cativeiroService {
  async getAll() {
    try {
      return await Cativeiros.find().populate('fazenda').populate('id_tipo_camarao');
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async Create(data) {
    try {
      const novo = new Cativeiros(data);
      return await novo.save();
    } catch (error) {
      console.log("Erro ao salvar cativeiro:", error);
      return null;
    }
  }
}

export default new cativeiroService(); 