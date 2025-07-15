// models/Cativeiros.js
import mongoose from "mongoose";

const CativeirosSchema = new mongoose.Schema({
  id_cativeiro: Number, // ou ObjectId, se preferir
  sitio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sitios",
    required: true,
  },
  id_tipo_camarao: {
    type: mongoose.Schema.Types.ObjectId, // Referência ao _id do TiposCamarao
    ref: "TiposCamarao",
    required: true,
  },
  data_instalacao: {
    type: Date,
    required: true,
  },
  foto_cativeiro: {
    type: Buffer, // Para armazenar binário (imagem)
    required: false,
  },
  temp_media_diaria: String,
  ph_medio_diario: String,
  amonia_media_diaria: String,
});

const Cativeiros = mongoose.model("Cativeiros", CativeirosSchema);
export default Cativeiros;