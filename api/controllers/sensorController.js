import sensorService from "../services/sensorService.js";

const createSensor = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.foto_sensor = req.file.buffer;
    }
    const result = await sensorService.create(data);
    if (!result) {
      return res.status(500).json({ error: "Falha ao salvar no banco." });
    }
    res.status(201).json({ message: "Sensor criado com sucesso!" });
  } catch (error) {
    console.log("Erro no controller:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const getAllSensores = async (req, res) => {
  try {
    const sensores = await sensorService.getAll();
    res.status(200).json(sensores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar sensores." });
  }
};

export default { createSensor, getAllSensores }; 