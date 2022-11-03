const controller = require('../controllers/product.controller')
const express = require('express')

const router = express.Router()


/**
 * Ruta: /user GET
 */
router.get('/',controller.getProductos)
router.get('/pos/:id',controller.getProductosPos)
router.get('/:id',controller.getProducto)
router.post('/',controller.upload,controller.uploadFile)
router.put('/:id',controller.upload,controller.updateProd)
router.delete('/:id',controller.deleteProducto)


module.exports = router