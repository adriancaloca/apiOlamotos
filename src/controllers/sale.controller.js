
import { getConnection } from "./../database/database";


const createSale = async (req, res) => {
    try {
        // const { name } = req.body;
        const { carrito, total, id_sucursal, id_usuario } = req.body;
        if (carrito === undefined || total === undefined) {
            res.status(404).json({ msg: "Bad request. Please fill all fils." })
        }
        const connection = await getConnection();
        const queryRes = await connection.query(`insert into venta(id_sucursal,id_usuario,fecha,subtotal,total,id_forma_pago) values(${id_sucursal},${id_usuario},now(),${total},${total},1) RETURNING id`)
        const idInsert = queryRes[0].id;
        for (const producto of carrito) {
            const { id, precio, motos } = producto;
            for (const moto of motos) {
                const { chasis, motor, nci, color } = moto;
                const queryRes = await connection.query(`insert into detalle_venta(id_venta,id_producto,total,chasis,motor,nci,color) values(${idInsert},${id},${precio},'${chasis}','${motor}','${nci}','${color}')`)
                const queryRes2 = await connection.query(`delete from almacen where chasis='${chasis}'`)
            }
        }
        res.json({ msg: "success" });
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar las sucursal ` + e);
    }
}

const getNS = async (req, res) => {
    try {
        const { id, prod } = req.params;
        const connection = await getConnection();
        const queryRes = await connection.query(`select concat(chasis,'|',motor,'|',nci,'|',color) as ns, chasis from almacen where id_sucursal=${id} and id_producto=${prod}`)
        res.status(200).json(queryRes);
    } catch (e) {
        res.status(500).json({ msg: "Bad request. Please try again" })
    }
}

const getSalesMonth = async (req, res) => {
    try {
        const connection = await getConnection();
        const queryRes = await connection.query(`select date_format(v.fecha,"%d/%m/%Y") as fecha,cast(count(d.id) as char) as articulos,v.id as id,s.nombre as sucursal,v.total from venta v inner join detalle_venta d on d.id_venta=v.id inner join sucursales s on v.id_sucursal=s.id where MONTH(v.fecha)=MONTH(now()) and YEAR(v.fecha)=YEAR(now()) group by v.id;`)
        res.status(200).json(queryRes);
    } catch (e) {
        res.status(500).json({ msg: "Bad request. Please try again" })
    }
}
const getSalesQuery = async (req, res) => {
    try {
        const {inicio, fin} = req.body;
        const connection = await getConnection();
        const queryRes = await connection.query(`select date_format(v.fecha,"%d/%m/%Y") as fecha,cast(count(d.id) as char) as articulos,v.id as id,s.nombre as sucursal,v.total from venta v inner join detalle_venta d on d.id_venta=v.id inner join sucursales s on v.id_sucursal=s.id where v.fecha between DATE_SUB('${inicio}',INTERVAL 1 DAY) and DATE_ADD('${fin}',INTERVAL 1 DAY) group by v.id;`)
        res.status(200).json(queryRes);
    } catch (e) {
        res.status(500).json({ msg: "Bad request. Please try again" })
    }
}
const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        if (id == undefined) {
            res.status(500).json({ msg: "Bad request. Please ty again    " })
        }
        const connection = await getConnection();
        const queryRes = await connection.query(`select d.id_producto,d.chasis,d.motor,d.nci,d.color,v.id_sucursal from detalle_venta d inner join venta v on v.id=d.id_venta where d.id_venta=${id}`)
        queryRes.forEach(async (element) => {
            const { chasis, id_producto, motor, nci, color, id_sucursal} = element;
            const queryRes = await connection.query(`insert into almacen(id_sucursal,id_producto,chasis,motor,nci,color) values (${id_sucursal},${id_producto},'${chasis}','${motor}','${nci}','${color}')`)
        });
        const queryRes2 = await connection.query(`delete from detalle_venta where id_venta=${id}`)
        const queryRes3 = await connection.query(`delete from venta where id=${id}`)
        res.status(200).json({msg: "success"});
    } catch (e) {
        console.log(id)
        res.status(500).json({ msg: "Bad request. Please try again" })
    }
}
const getDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (id === undefined) {
            res.status(500).json({ msg: "Bad request. Please try again" })
            return;
        }
        const connection = await getConnection();
        const queryRes = await connection.query(`select d.chasis,d.motor,d.nci,d.color,p.nombre as producto,c.nombre as categorias from detalle_venta d inner join producto p on p.id=d.id_producto inner join categoria_producto c on c.id=p.id_categoria where d.id_venta=${id};`)
        res.status(200).json(queryRes);
    } catch (e) {
        res.status(500).json({ msg: "Bad request. Please try again" })
    }
}


export const methods = {
    createSale,
    getNS,
    getSalesMonth,
    getSalesQuery,
    deleteSale,
    getDetails
}