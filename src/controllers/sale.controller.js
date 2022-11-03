
import {getConnection} from "./../database/database";


const createSale= async(req,res) => {
    try {
        console.log(req.body);
        // const { name } = req.body;
        // if(name === undefined){
        //     res.status(404).json({msg: "Bad request. Please fill all fils."})
        // }
        // const connection = await getConnection()
        // const queryRes = await connection.query(`insert into sucursales(nombre) values('${name}')`)
        // res.json({msg: "success"});
    } catch (e) {
        res.status(500);
        res.send(`Error al consultar las sucursal `+e);
        console.log(e);
    }
}

export const methods = {
    createSale
}