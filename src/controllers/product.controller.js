import { getConnection } from "../database/database";
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../pos/assets/imgs/shop')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

exports.upload = upload.single('myFile')

exports.uploadFile = async (req, res) => {
    try {
        const { name, cat, myFileName, precio,id_usuario } = req.body;
        if (name === undefined || cat === undefined) {
            res.status(404).json({ msg: "Bad request. Please fill all fils." })
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`insert into producto(id_categoria,id_usuario,nombre,precio,creado,img) values(${cat},${id_usuario},'${name}',${precio},now(),'${myFileName}')`)
        res.json({ msg: "success" });
    } catch (e) {
        res.status(500);
        res.send(`Error al actuaizar el producto ` + e);
    }
}
exports.updateProd = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, cat, myFileName, precio } = req.body;
        if (name === undefined || cat === undefined || id === undefined) {
            res.status(404).json({ msg: "Bad request. Please fill all fils." })
        }
        const connection = await getConnection()
        if(myFileName === 'undefined'){
            const queryRes = await connection.query(`update producto set id_categoria=${cat},nombre='${name}', precio=${precio} where id=${id}`)
            res.json({ msg: "success" });
        }else{
            const queryRes = await connection.query(`update producto set id_categoria=${cat},nombre='${name}',img='${myFileName}',precio=${precio} where id=${id}`)
            res.json({ msg: "success" });
        }
    } catch (e) {
        res.status(500);
        res.send(`Error al actualizar el producto ` + e);
    }
}

exports.getProductos = async (req, res) => {
    try {
        const connection = await getConnection()
        const queryRes = await connection.query(`select p.id,p.nombre as nombre,c.nombre as categoria,DATE_FORMAT(p.creado,'%d/%m/%Y') AS fecha,p.img,p.precio as precio from producto p inner join categoria_producto c on c.id=p.id_categoria`)
        res.json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar las sucursal ` + e);
    }
}

exports.getProductosPos = async (req, res) => {
    try {
        const { id } = req.params;
        if(id === undefined){
            res.status(404).json({msg: "Bad request. Please fill al fils"});
            return;
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`select c.nombre as categoria,p.img as img,FORMAT(FLOOR(COUNT(a.id_producto)),0) as qty,p.nombre as nombre,p.precio,p.id from producto p inner join categoria_producto c on c.id=p.id_categoria inner join almacen a on a.id_producto=p.id where a.id_sucursal=${id} group by a.id_producto`)
        res.json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar las sucursal ` + e);
    }
}
exports.getProducto = async (req, res) => {
    try {
        const { id } = req.params;
        if (id === undefined) {
            res.status(404).json({ msg: "Bad request. Please fill all fils." })
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`select id,nombre,id_categoria,img,precio from producto where id=${id}`)
        res.json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar el producto ` + e);
    }
}
exports.deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        if (id === undefined) {
            res.status(404).json({ msg: "Bad request. Please fill all fils." })
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`delete from producto where id=${id}`)
        res.json({ msg: "success" });
    } catch (e) {
        res.status(500);
        res.send(`Error al eliminar el producto ` + e);
    }
}