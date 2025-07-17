// models/Cativeiros.js
import mongoose from "mongoose";

const CativeirosSchema = new mongoose.Schema({
  id_cativeiro: Number, // ou ObjectId, se preferir
  fazenda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fazendas",
    required: true,
  },
  id_tipo_camarao: {
    type: mongoose.Schema.Types.ObjectId, // Referência ao _id do TiposCamarao
    ref: "TiposCamaroes",
    required: true,
  },
  data_instalacao: {
    type: Date,
    required: true,
  },
  foto_cativeiro: {
    type: Buffer, // Para armazenar binário (imagem)
    required: false,
    default: null
  },
  temp_media_diaria: String,
  ph_medio_diario: String,
  amonia_media_diaria: String,
});

const Cativeiros = mongoose.model("Cativeiros", CativeirosSchema);
export default Cativeiros;