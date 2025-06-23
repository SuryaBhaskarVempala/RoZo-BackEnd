const express = require('express');

const router = express.Router();
const Plant = require('../Schemas/Plant');
const { getPlants, getPlantsById, fetchPlantByColorSizeId ,updatePlant,addPlant,deletePlant} = require('../controllers/PlantsData');

router.get('/', getPlants);

router.get('/:id', getPlantsById);

router.get('/fetchPlant/:id/:size/:color', fetchPlantByColorSizeId);

router.post('/addPlant',addPlant);

router.post('/updatePlant/:id', updatePlant);

router.delete('/deletePlant/:id', deletePlant);

module.exports = router;