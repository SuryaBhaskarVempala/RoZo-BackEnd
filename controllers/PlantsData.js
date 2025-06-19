const Plant = require("../Schemas/Plant");
const logger = require("../utils/logger");

const getPlants = async (req, res) => {
  const endpoint = "[GET /plants]";
  try {
    const plants = await Plant.find();
    logger.info(`${endpoint} Fetched ${plants.length} plants`);
    res.status(200).json({ plants });
  } catch (error) {
    logger.error(`${endpoint} Error fetching plants: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPlantsById = async (req, res) => {
  const endpoint = "[GET /plants/:id]";
  try {
    const plantId = req.params.id;
    logger.info(`${endpoint} Fetching plant with ID: ${plantId}`);
    const plant = await Plant.findOne({ id: plantId });

    if (!plant) {
      logger.warn(`${endpoint} Plant not found for ID: ${plantId}`);
      return res.status(404).json({ message: "Plant not found" });
    }

    logger.info(`${endpoint} Plant found: ${plant.name || "No name"}`);
    res.status(200).json({ plant });
  } catch (error) {
    logger.error(`${endpoint} Error fetching plant by ID: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const fetchPlantByColorSizeId = async (req, res) => {
  const endpoint = "[GET /plants/:id/:color/:size]";
  const { id, size, color } = req.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    logger.warn(`${endpoint} Invalid plant ID: ${id}`);
    return res.status(400).json({ message: "Invalid plant ID" });
  }

  try {
    const plant = await Plant.findOne({ id: numericId });
    if (!plant) {
      logger.warn(`${endpoint} Plant not found: ID=${numericId}`);
      return res.status(404).json({ message: "Plant not found" });
    }

    const potColor = plant.potColors.find(p => p.name.toLowerCase() === color.toLowerCase());
    if (!potColor) {
      logger.warn(`${endpoint} Color "${color}" not found for plant ID=${numericId}`);
      return res.status(404).json({ message: "Color not found" });
    }

    let available = 0;
    if (size === 'small') available = potColor.smallPotsCount;
    else if (size === 'medium') available = potColor.mediumPotsCount;
    else if (size === 'large') available = potColor.largePotsCount;
    else {
      logger.warn(`${endpoint} Invalid size "${size}" requested`);
      return res.status(400).json({ message: "Invalid size" });
    }

    logger.info(`${endpoint} Available ${size} pots: ${available} (Plant ID=${numericId}, Color=${color})`);
    return res.json({ available });
  } catch (err) {
    logger.error(`${endpoint} Error: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPlants,
  getPlantsById,
  fetchPlantByColorSizeId
};
