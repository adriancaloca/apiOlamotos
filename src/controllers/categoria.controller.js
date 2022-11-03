import {getConnection} from "./../database/database";

const getCategorias= async(req,res) => {
    try {
        const connection = await getConnection()
        const queryRes = await connection.query(`select c.id,c.nombre,CAST(count(p.id) AS CHAR) as productos from categoria_producto c left join producto p on p.id_categoria=c.id group by c.id;`)
        res.json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar las categorias`+e);
        console.log(e);
    }
}
const getCategoria= async(req,res) => {
    try {
        const {id} = req.params;
        if(id === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils."})
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`select id,nombre from categoria_producto where id=${id}`)
        res.json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar la categoria `+e);
    }
}

const createCategoria= async(req,res) => {
    try {
        const { name } = req.body;
        if(name === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils."})
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`insert into categoria_producto(nombre) values('${name}')`)
        res.json({msg: "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al crear la categoria `+e);
        console.log(e);
    }
}
const updateCategoria= async(req,res) => {
    try {
        const {id} = req.params;
        const { name } = req.body;
        if(id === undefined || name === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils."})
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`update categoria_producto set nombre='${name}' where id=${id}`)
        res.json({msg: "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al actualizar la categoria `+e);
        console.log(e);
    }
}
const deleteCategoria= async(req,res) => {
    try {
        const {id} = req.params;
        if(id === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils."})
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`delete from categoria_producto where id=${id}`)
        res.json({msg: "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al eliminar la categoria `+e);
        console.log(e);
    }
}

export const methods = {
    getCategorias,
    getCategoria,
    updateCategoria,
    deleteCategoria,
    createCategoria
}