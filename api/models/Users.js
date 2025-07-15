import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nome: { // <-- Adicione esta linha
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  foto_perfil: {
    type: Buffer,
    required: false,
  },
  sitio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sitios',
    required: false
  },
});

const User = mongoose.model("User", userSchema);

export default User;
