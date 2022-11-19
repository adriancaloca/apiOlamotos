import { getConnection } from "../database/database";
const fs = require('fs');
const xml2js = require('xml2js')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

exports.upload = upload.single('myFile')

exports.uploadFile = async (req, res) => {
    try {
        const { myFileName } = req.body;
        let motosArray = [];
        fs.readFile(`./src/uploads/${myFileName}`, 'utf8', async (err, data) => {
            const articulos = data.substring(data.indexOf('<cfdi:Addenda>') + 14, data.indexOf('</cfdi:Addenda>'))
            xml2js.parseString(articulos, async (err, result) => {
                fs.unlinkSync(`./src/uploads/${myFileName}`);
                const { Articulos: { Articulo } } = result;
                Articulo.forEach(moto => {
                    //ARRAY PARA ALMACENAR LAS MOTOS QUE CORRESPONDEN A ESTE MODELO
                    const motos = [];
                    //OBTENER EL NOMBRE DE LA MOTO EIMINANDO DATOS INECESARIOS
                    const objAttr = moto.$.Nombre.split("MODELO");
                    const modelo = objAttr[1].replaceAll(",", "").split("COLOR");
                    const nombreMoto = modelo[0].replaceAll(": ", "").replaceAll(":", "").trim();
                    const color = modelo[1].replaceAll(",", "").split("AÑO");
                    const nombreColor = color[0].replaceAll(": ", "").replaceAll(":", "").trim();
                    const existe = motosArray.some(moto => moto.modelo === nombreMoto);
                    //OBTENER LOS NUMEROS DE SERIE DE LAS MOTOS DE ESTE MODELO
                    const { DetalleMoto } = moto;
                    //ARRAY QUE CONTIENE LAS MOTOS QUE FUERON COMPRADAS
                    DetalleMoto.forEach(detalle => {
                        const { Chasis, Motor, Nci } = detalle;
                        const obj = {
                            chasis: Chasis[0],
                            motor: Motor[0],
                            nci: Nci[0],
                            color: nombreColor
                        }
                        motos.push(obj)
                    })
                    if (existe) {
                        const copiaMotos = motosArray.map(p => {
                            if (p.modelo == nombreMoto) {
                                motos.forEach(mto => {
                                    p.motos = [...p.motos, mto];
                                })
                                return p;
                            } else {
                                return p;
                            }
                        })
                    } else {
                        //DATOS FINAL DE LA MOTO 
                        let motoFinal = {
                            existe: false,
                            modelo: nombreMoto,
                            motos
                        }
                        motosArray = [...motosArray, motoFinal];
                    }
                })
                motosArray = await validaExiste(motosArray,res);
            })
        });
    } catch (e) {
        res.status(500);
        res.send(`Error al subir el inventario ` + e);
    }
}

async function validaExiste(motosArray,res) {
    const connection = await getConnection();
    for (const moto of motosArray) {
        const { modelo } = moto;
        const queryRes = await connection.query(`select id from producto where UPPER(nombre)=UPPER('${modelo}')`)
        if (queryRes && queryRes.length > 0) {
            moto.existe = true;
            moto.id = queryRes[0].id;
        } else {
            moto.existe = false;
            moto.id = null;
        }
    }
    res.json(await motosArray);
}

exports.cargaProductos = async (req,res) => {
    const {sucursal,motosArray,id_} = req.body;
    const connection = await getConnection();
    for (const moto of motosArray) {
        const { existe, modelo,motos,id } = moto;
        if(existe){
            for(const detalleMoto of motos){
                try{
                    const {chasis,motor,nci,color} = detalleMoto;
                    const queryRes = await connection.query(`insert into almacen(id_sucursal,id_producto,chasis,motor,nci,color) values(${sucursal},${id},'${chasis}','${motor}','${nci}','${color}')`)
                }catch(e){
                }
            }
        }else{
            try{
                const queryRes = await connection.query(`insert into producto(id_categoria,id_usuario,nombre,precio,creado,img) values(1,${id_usuario},'${modelo}',0,now(),'product.jpg') RETURNING id`)
                const idNuevo = queryRes[0].id;
                for(const detalleMoto of motos){
                    try{
                        const {chasis,motor,nci,color} = detalleMoto;
                        const queryRes = await connection.query(`insert into almacen(id_sucursal,id_producto,chasis,motor,nci,color) values(${sucursal},${idNuevo},'${chasis}','${motor}','${nci}','${color}')`)
                    }catch(e){
                    }
                }
            }catch(e){
            }
        }
    }
    res.json({msg: "success"});
}
