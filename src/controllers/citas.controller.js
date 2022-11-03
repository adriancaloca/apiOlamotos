import { getConnection } from "../database/database";

const getCitas = async (req, res) => {
    try {
        const connection = await getConnection()
        const queryRes = await connection.query("Select c.id,c.nombre,c.telefono,s.nombre as sucursal,c.fecha,c.hora from citas_servicio c inner join sucursales s on s.id=c.id_sucursal")
        res.json(queryRes)
    } catch (e) {
        res.status(500);
        res.send("Error al realizar la consulta"+e);
    }
};
const addCitas = async (req, res) => {
    try {
        const { id_sucursal, nombre, telefono, fecha, hora } = req.body;
        const connection = await getConnection()
        const queryRes = await connection.query(`INSERT INTO citas_servicio(id_sucursal,nombre,telefono,fecha,hora) VALUES (${id_sucursal},'${nombre}','${telefono}','${fecha}','${hora}')`)
        res.json({msg : "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al generar la cita ${e}`);
    }
};
const deleteCita = async (req, res) => {
    try {
        const {id} = req.params;
        if(id === undefined){
            res.status(400).json({msg: "Bad request, Please fill all fils"})
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`DELETE FROM citas_servicio where id=${id}`)
        res.status(200).json({msg: "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al generar la cita ${e}`);
    }
};

export const methods = {
    getCitas,
    addCitas,
    deleteCita
};