import { getConnection } from "../database/database";
const node_xml_stream = require('node-xml-stream');
const parser = new node_xml_stream();
const fs = require('fs');

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
        // temporary variables to construct final object
        let user = { 'items': [] };
        let driver, team, attr, qty=0, t_name;
        // callback contains the name of the node and any attributes associated
        parser.on('opentag', function (name, attrs) {
            if (name === 'Articulo') {
                attr = attrs;
            }
            if (name === 'DetalleMoto') {
                qty++;
            }
            t_name = name;
        });
        // callback contains the name of the node.
        parser.on('closetag', function (name) {
            try{
                if (name === 'Articulo') {
                    console.log('add element')
                    const objAttr = attr.Nombre.split("MODELO");
                    const modelo = objAttr[1].replaceAll(",","").split("COLOR");
                    user['items'].push({ "nombre": modelo[0].replaceAll(": ","").replaceAll(":","").trim(), "qty": qty});
                    qty=0;
                }
            }catch(e){
                res.status(500).json({msg: "error"})
            }
        });
        // // callback contains the text within the node.
        // parser.on('text', function (text) {
        //     // if (t_name === 'DetalleMoto') {
        //     //     qty++;
        //     // }
        // });
        // callback to do something after stream has finished
        parser.on('finish', function () {
            fs.unlinkSync(`./src/uploads/${myFileName}`);
            res.status(200).json(user)
        });
        let stream = fs.createReadStream(`./src/uploads/${myFileName}`, 'UTF-8');
        stream.pipe(parser);




    } catch (e) {
        res.status(500);
        res.send(`Error al subir el inventario ` + e);
        console.log(e);
    }
}