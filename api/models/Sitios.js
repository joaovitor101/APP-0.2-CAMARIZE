import mongoose from "mongoose";

console.log('Sitios model carregado');

const CounterSchema = new mongoose.Schema({
  _id: String,
  seq: Number
});

const SitiosSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true,
    default: -1
  },
  nome: {
    type: String,
    required: true,
  },
  rua: {
    type: String,
    required: true,
  },
  bairro: {
    type: String,
    required: true,
  },
  cidade: {
    type: String,
    required: true,
  },
  numero: {
    type: Number,
    required: true,
  },
  foto_sitio: {
    type: Buffer,
    required: false,
  }
}, {
  collection: "Sitios",
  timestamps: false
});

// Hook robusto para autoincrementar o campo codigo
SitiosSchema.pre('save', async function(next) {
  console.log('Pre-save hook chamado para Sitios');
  if (this.isNew && (this.codigo === undefined || this.codigo === null || this.codigo === -1)) {
    try {
      const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'sitio_codigo' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      if (!counter || typeof counter.seq !== 'number') {
        return next(new Error('Falha ao gerar código sequencial para o sítio.'));
      }
      this.codigo = counter.seq;
      console.log('Novo código atribuído ao sítio:', this.codigo);
      next();
    } catch (err) {
      console.error('Erro no pre-save do Sitios:', err);
      next(err);
    }
  } else if (this.codigo === null || this.codigo === undefined || this.codigo === -1) {
    return next(new Error('O campo codigo não pode ser nulo.'));
  } else {
    next();
  }
});

const Sitios = mongoose.model("sitios", SitiosSchema);
export default Sitios;