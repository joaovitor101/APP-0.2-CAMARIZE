import Sensores from "../models/Sensores.js";

class sensorService {
  async getAll() {
    try {
      return await Sensores.find().populate('id_tipo_sensor');
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async create(data) {
    try {
      const novo = new Sensores(data);
      return await novo.save();
    } catch (error) {
      console.log("Erro ao salvar sensor:", error);
      return null;
    }
  }
}

export default new sensorService(); 