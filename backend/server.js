import express from "express"
import env from "dotenv"
import morgan from "morgan";

import router from "./routes/all_routes.js";

env.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(morgan("dev"));

app.use(router);

app.listen(port, () => { console.log(`Port: ${port}`); });