import { getConnection } from "../database/database";

const getUsers = async (req, res) => {
    try {
        const connection = await getConnection()
        const queryRes = await connection.query('SELECT s.nombre as office,u.id as id ,u.nombre as nombre,if(u.privilegios=9, "Administrador", "Vendedor") as permissions,u.creado FROM usuarios u inner join sucursales s on u.id_sucursal=s.id')
        res.json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar usuarios ${e}`);
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (id === undefined) {
            res.status(400).json({ msg: "Bad request. Please fill al field." })
            return;
        }
        const connection = await getConnection()
        const queryRes = await connection.query('SELECT s.nombre as office,s.id as idOffice,u.id as id ,u.nombre as nombre,if(u.privilegios=9, "Administrador", "Vendedor") as permissions, u.privilegios as idPermissions FROM usuarios u inner join sucursales s on u.id_sucursal=s.id where u.id=?', id)
        if (queryRes.length === 0) {
            res.status(404).json({ msg: "User not found. Please try again." })
            return;
        } else {
            res.json(queryRes);
        }
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar usuarios ${e}`);
    }
};

const addUser = async (req, res) => {
    try {
        const { office, user, pass, permissions } = req.body;
        if (office === undefined || user === undefined || pass === undefined || permissions === undefined) {
            res.status(400).json({ msg: "Bad request. Please fill all field." })
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`INSERT INTO usuarios(id_sucursal,nombre,pass,privilegios,activo,creado) values (${office},'${user.toLowerCase()}',md5('${pass}'),${permissions},1,now())`)
        const responseAPI = { msg: "success" };
        res.json(responseAPI);
    } catch (e) {
        res.status(500);
        res.send(`Error al crear el usuario ${e}`);
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_sucursal, nombre, pass, privilegios } = req.body;
        if (id === undefined) {
            res.status(400).json({ msg: "Bad request. Please fill al field. (ID)" })
            return;
        }
        if (id_sucursal === undefined || nombre === undefined || privilegios === undefined) {
            res.status(400).json({ msg: "Bad request. Please fill all field. (BODY)" })
        } else {
            const connection = await getConnection()
            if (pass === undefined) {
                const queryRes = await connection.query(`UPDATE usuarios set id_sucursal=${id_sucursal},nombre='${nombre}',privilegios=${privilegios} where id = ${id}`)
                res.status(200).json({ msg: "success" });
            } else {
                const queryRes = await connection.query(`UPDATE usuarios set id_sucursal=${id_sucursal},nombre='${nombre}',privilegios=${privilegios},pass=md5('${pass}') where id = ${id}`)
                res.status(200).json({ msg: "success" });
            }
        }
    } catch (e) {
        res.status(500);
        res.send(`Error al actualizar el usuario ${e}`);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (id === undefined) {
            res.status(400).json({ msg: "Bad request. Please fill al field. (ID)" })
            return;
        } else {
            const connection = await getConnection()
            const queryRes = await connection.query(`delete from usuarios where id = ${id}`)
            res.status(200).json({ msg: "success" });
        }
    } catch (e) {
        res.status(500);
        res.send(`Error al eliminar el usuario ${e}`);
    }
};


export const methods = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
}