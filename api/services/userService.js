import User from "../models/Users.js";

class userService {
  
  // Método para cadastrar um usuário
  async Create(nome, email, senha, foto_perfil, fazenda) {
    try {
      console.log("📝 [SERVICE] Criando usuário:", { nome, email, senha: "***", foto_perfil, fazenda });
      
      const newUser = new User({
        nome,
        email,
        senha,
        foto_perfil,
        fazenda,
      });
      
      console.log("💾 [SERVICE] Salvando usuário no banco...");
      const savedUser = await newUser.save();
      console.log("✅ [SERVICE] Usuário salvo com sucesso:", savedUser._id);
      
      return savedUser;
    } catch (error) {
      console.error("❌ [SERVICE] Erro ao criar usuário:", error);
      throw error;
    }
  }
  // Método para listar um usuário
  async getOne(email) {
    try {
      console.log("🔍 [SERVICE] Buscando usuário com email:", email);
      const user = await User.findOne({ email: email });
      console.log("🔍 [SERVICE] Resultado da busca:", user ? `Usuário encontrado (${user._id})` : "Usuário não encontrado");
      return user;
    } catch (error) {
      console.error("❌ [SERVICE] Erro ao buscar usuário:", error);
      throw error;
    }
  }
 




  async getById(id) {
    return await User.findById(id);
  }

  // Atualizar foto do usuário
  async updatePhoto(id, foto_perfil) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, { foto_perfil }, { new: true });
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

export default new userService();
