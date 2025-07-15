
import mongoose from "mongoose";

const TiposSensorSchema = new mongoose.Schema({
  descricao: {
    type: String,
    maxlength: 100,
    required: false,
  },
  foto_sensor: {
    type: Buffer,
    required: false,
  }
}, {
  collection: "Tipos_sensor"
});

const TiposSensor = mongoose.model("TiposSensor", TiposSensorSchema);
export default TiposSensor; 