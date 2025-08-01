const express = require('express');
const mainRouter = express.Router();
const { createBrand, getBrandDetails, getAllBrands, addPaintAndTileToBrand, updatePaintInBrand, updateTileInBrand } = require('../controllers/brandController');
const { createDesign, getDesignsByUserId, updateDesignById, deleteDesignById } = require('../controllers/designController');
const upload = require('../middlewares/multerConfig'); 

mainRouter.post('/brands', createBrand);
mainRouter.get('/brands/:id', getBrandDetails);
mainRouter.get('/brands', getAllBrands);
mainRouter.put('/brands/:brandId/add-items', addPaintAndTileToBrand);
mainRouter.put('/brands/:brandId/paints/:paintId', updatePaintInBrand);
mainRouter.put('/brands/:brandId/tiles/:tileId', updateTileInBrand);

// xử lý multipart/form-data với ảnh
mainRouter.post('/designs', upload, createDesign);
mainRouter.get('/designs/user/:id_user', getDesignsByUserId);
mainRouter.put('/designs/:id_design',upload,updateDesignById);
mainRouter.delete('/delete-design/:id_design', deleteDesignById);

module.exports = mainRouter;
