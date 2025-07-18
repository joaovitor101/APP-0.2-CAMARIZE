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

  async getById(id) {
    try {
      return await Cativeiros.findById(id).populate('fazenda').populate('id_tipo_camarao');
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new cativeiroService(); 