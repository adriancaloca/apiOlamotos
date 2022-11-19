
import {getConnection} from "./../database/database";

const getSucursales= async(req,res) => {
    try {
        const connection = await getConnection()
        const queryRes = await connection.query(`select s.id,s.nombre,CAST(count(u.id) AS CHAR) as usuarios from sucursales s left join usuarios u on s.id=u.id_sucursal group by s.id;`)
        res.json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar las sucursales`+e);
    }
}
const getSucursal= async(req,res) => {
    try {
        const {id} = req.params;
        if(id === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils."})
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`select id,nombre from sucursales where id=${id}`)
        res.json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar las sucursal `+e);
    }
}

const createSucursal= async(req,res) => {
    try {
        const { name } = req.body;
        if(name === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils."})
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`insert into sucursales(nombre) values('${name}')`)
        res.json({msg: "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar las sucursal `+e);
    }
}
const updateSucursal= async(req,res) => {
    try {
        const {id} = req.params;
        const { name } = req.body;
        if(id === undefined || name === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils."})
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`update sucursales set nombre='${name}' where id=${id}`)
        res.json({msg: "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar las sucursal `+e);
    }
}
const deleteSucursal= async(req,res) => {
    try {
        const {id} = req.params;
        if(id === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils."})
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`delete from sucursales where id=${id}`)
        res.json({msg: "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar las sucursal `+e);
    }
}

export const methods = {
    getSucursales,
    getSucursal,
    updateSucursal,
    deleteSucursal,
    createSucursal
}