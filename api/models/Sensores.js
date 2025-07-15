// models/Sensores.js
import mongoose from "mongoose";

const SensoresSchema = new mongoose.Schema({
  id_tipo_sensor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TiposSensor", // Nome do modelo referenciado
    required: true,
  },
  apelido: {
    type: String,
    maxlength: 100,
    required: false,
  },
  foto_sensor: {
    type: Buffer, // Para armazenar binário (imagem)
    required: false,
  }
}, {
  collection: "Sensores",
  timestamps: false
});

const Sensores = mongoose.model("Sensores", SensoresSchema);
export default Sensores;