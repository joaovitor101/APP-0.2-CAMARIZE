import User from "../models/Users.js";

class userService {
  
  // Método para cadastrar um usuário
  async Create(nome, email, senha, foto_perfil, fazenda) {
    const newUser = new User({
      nome,
      email,
      senha,
      foto_perfil,
      fazenda,
    });
    await newUser.save();
    return newUser;
  }
  // Método para listar um usuário
  async getOne(email) {
    try {
      const user = await User.findOne({ email: email });
      return user;
    } catch (error) {
      console.log(error);
    }
  }
 




  async getById(id) {
    return await User.findById(id);
  }
}

export default new userService();
