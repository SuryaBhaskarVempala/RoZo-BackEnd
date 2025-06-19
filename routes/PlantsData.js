const express = require('express');

const router = express.Router();
const Plant = require('../Schemas/Plant');
const { getPlants, getPlantsById, fetchPlantByColorSizeId } = require('../controllers/PlantsData');

router.get('/', getPlants);

router.get('/:id', getPlantsById);

router.get('/fetchPlant/:id/:size/:color', fetchPlantByColorSizeId);


module.exports = router;