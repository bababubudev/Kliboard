import express from "express";
import env from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

import router from "./routes/all_routes.js";

env.config();
mongoose.connect(process.env.DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(on_connect).catch(on_fail);

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/", router);

function on_connect()
{
    console.log("Successfully connected to the database!");
    app.listen(port, "kliboard.railway.internal" ,() => { console.log(`Listening on port ${port}...`); });
}

function on_fail(err)
{
    console.error(`Failed to connect to the database \n${err}`);
}