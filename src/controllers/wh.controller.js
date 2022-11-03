import { getConnection } from "../database/database";

const getWHs = async (req, res) => {
    try {
        const connection = await getConnection()
        const queryRes = await connection.query('SELECT s.nombre as office,s.id as id,CAST(count(a.id) AS CHAR) as totalProductos,CAST(FORMAT(FLOOR(sum(a.cantidad)),0) AS CHAR) as totalItems FROM sucursales s left join almacen a on a.id_sucursal=s.id group by a.id_sucursal')
        res.json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar usuarios ${e}`);
    }
};
const stadistics = async (req, res) => {
    try {
        const connection = await getConnection()
        const queryRes = await connection.query('select (select cast(count(id) as char) from producto) as productos, (select CAST(FORMAT(FLOOR(sum(a.cantidad)),0) AS CHAR) from almacen a) as cantidades, (select cast(count(id) as char) from categoria_producto) as categorias, (SELECT cast(COUNT(id) as char) from usuarios) as usuarios;')
        res.json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar usuarios ${e}`);
    }
};
const getWH = async (req, res) => {
    try {
        const {id} = req.params;
        if(id === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils"})
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`select a.cantidad,a.id,p.nombre from almacen a inner join producto p on p.id=a.id_producto where a.id_sucursal=${id}`)
        res.json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar usuarios ${e}`);
    }
};
const createWH = async (req, res) => {
    try {
        const { office, prod, qty } = req.body;
        if(office === undefined || prod === undefined || qty === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils"})
            return;
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`insert into almacen(id_sucursal,id_producto,cantidad) values (${office},${prod},${qty})`)
        res.json({msg: "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al agregar producto a almacen ${e}`);
    }
};
const updateWH = async (req, res) => {
    try {
        const { id } = req.params;
        const { qty } = req.body;
        if( qty === undefined || id === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils"})
            return;
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`update almacen set cantidad=${qty} where id=${id}`)
        res.json({msg: "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al actualizar producto a almacen ${e}`);
    }
};
const deleteWH = async (req, res) => {
    try {
        const { id } = req.params;
        if(id === undefined){
            res.status(404).json({msg: "Bad request. Please fill all fils"})
            return;
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`delete from almacen where id=${id}`)
        res.json({msg: "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al eliminar producto a almacen ${e}`);
    }
};

export const methods = {
    getWHs,
    getWH,
    createWH,
    updateWH,
    deleteWH,
    stadistics
}
