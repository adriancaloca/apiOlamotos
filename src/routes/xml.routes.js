const controller = require('../controllers/xml.controller')
const express = require('express')

const router = express.Router()


router.post('/',controller.upload,controller.uploadFile)
router.post('/carga/',controller.cargaProductos)


module.exports = router