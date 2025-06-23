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


const updatePlant = async (req, res) => {
  const plantId = req.params.id;
  const {plant} = req.body; // This should be the whole plant object
  const endpoint = `[PUT /plants/${plantId}]`;

  try {
    console.log(`${endpoint} Updating plant with ID: ${plantId}`);

    const updatedPlant = await Plant.findByIdAndUpdate(
      plantId,
      plant,
      { new: true, runValidators: true }
    );

    console.log(updatedPlant);

    if (!updatedPlant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.status(200).json({ message: 'Plant updated successfully', plant: updatedPlant });
  } catch (error) {
    console.error(`${endpoint} Error updating plant: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deletePlant = async (req, res) => {
  const plantId = req.params.id;
  const endpoint = `[DELETE /plants/${plantId}]`;
  try {
    logger.info(`${endpoint} Deleting plant with ID: ${plantId}`);
    const deletedPlant = await Plant.findOneAndDelete({ id: plantId });

    if (!deletedPlant) {
      logger.warn(`${endpoint} Plant not found for ID: ${plantId}`);
      return res.status(404).json({ message: "Plant not found" });
    }

    logger.info(`${endpoint} Plant deleted successfully`);
    res.status(200).json({ message: "Plant deleted successfully" });
  } catch (error) {
    logger.error(`${endpoint} Error deleting plant: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const addPlant = async (req, res) => {
  const { plant } = req.body;
  const endpoint = "[POST /plants/addPlant]";
  try {
    logger.info(`${endpoint} Adding new plant: ${plant.name || "No name provided"}`);
    const newPlant = new Plant(plant);
    await newPlant.save();
    logger.info(`${endpoint} Plant added successfully`);
    res.status(201).json({ message: "Plant added successfully", plant: newPlant });
  } catch (error) {
    logger.error(`${endpoint} Error adding plant: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getPlants,
  getPlantsById,
  fetchPlantByColorSizeId,
  updatePlant,
  deletePlant,
  addPlant
};
