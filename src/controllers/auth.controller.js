import {getConnection} from "./../database/database";

const validateUser= async(req,res) => {
    try {
        const {user,password} = req.body;
        if(user === undefined || password=== undefined){
            res.status(404).json({msg: "Bad Request. Please try again"})
        }
        const connection = await getConnection()
        const queryRes = await connection.query(`select id,id_sucursal,nombre,privilegios from usuarios where nombre='${user}' and pass=md5('${password}');`)
        res.status(200).json(queryRes);
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar las categorias`+e);
        console.log(e);
    }
}

export const methods = {
    validateUser
}