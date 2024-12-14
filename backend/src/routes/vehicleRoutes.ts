import express from 'express';
import * as vehicleController from '../controllers/vehicleController';
// import { validateVehicleInput, validateStatusUpdate } from '../middleware/vehicleValidator';

const router = express.Router();

router.post('/',  vehicleController.addVehicle);
router.put('/:id',  vehicleController.updateVehicle);
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.patch('/:id/status',  vehicleController.updateVehicleStatus);
router.delete('/:id', vehicleController.deleteVehicleById);

export default router;

