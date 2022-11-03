import express  from "express";
import morgan  from "morgan";
//Routes
import citasRoutes from "./routes/citas.routes";
import mailRoutes from "./routes/mail.routes";
import sucursalesRoutes from "./routes/sucursales.routes";
import usersRoutes from "./routes/users.routes";
import catRoutes from "./routes/categoria.routes";
import prodRoutes from "./routes/product.routes";
import whRoutes from "./routes/wh.routes";
import salesRoutes from "./routes/sale.routes";
import xmlRoutes from "./routes/xml.routes";

const cors = require('cors')
const app  = express();
//Settings
app.use(cors());
app.set("port",4000)

//Middlewares
app.use(morgan("dev"));

app.use(express.json());

//Routes
app.use("/api/citas",citasRoutes);

app.use("/api/mail",mailRoutes);

app.use("/api/suc",sucursalesRoutes);

app.use("/api/users",usersRoutes);

app.use("/api/cat",catRoutes);

app.use("/api/prod",prodRoutes);

app.use("/api/wh",whRoutes);

app.use("/api/sales",salesRoutes);

app.use("/api/xml",xmlRoutes);

export default app;