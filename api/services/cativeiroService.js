import Cativeiros from "../models/Cativeiros.js";

class cativeiroService {
  async getAll() {
    try {
      return await Cativeiros.find()
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
      return await Cativeiros.findById(id)
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getAllByUsuarioViaRelacionamentos(usuarioId) {
    try {
      // Buscar IDs das fazendas do usuário, populando os dados completos das fazendas
      const UsuariosxFazendas = (await import('../models/UsuariosxFazendas.js')).default;
      const FazendasxCativeiros = (await import('../models/FazendasxCativeiros.js')).default;
      const Cativeiros = (await import('../models/Cativeiros.js')).default;
      const fazendasDoUsuario = await UsuariosxFazendas.find({ usuario: usuarioId }).populate('fazenda');
      const fazendaIds = fazendasDoUsuario.map(f => f.fazenda._id || f.fazenda);
      // Buscar cativeiros dessas fazendas
      const rels = await FazendasxCativeiros.find({ fazenda: { $in: fazendaIds } }, 'cativeiro');
      const cativeiroIds = rels.map(r => r.cativeiro);
      // Buscar dados completos dos cativeiros, populando tipo de camarão
      return await Cativeiros.find({ _id: { $in: cativeiroIds } }).populate('id_tipo_camarao');
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

export default new cativeiroService(); 