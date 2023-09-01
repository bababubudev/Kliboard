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
const rate_limit_duration = 86400000;
const max_requests_per_IP = 10;

const req_counts = new Map();

app.use(express.json());
app.use(cors({ exposedHeaders: ["X-RateLimit-Warning"] }));
app.use(morgan("dev"));
app.use(limiter_middleware);
app.use("/api/", router);

function on_connect()
{
    console.log("Successfully connected to the database!");
    app.listen(port ,() => { console.log(`Listening on port ${port}...`); });
}

function on_fail(err)
{
    console.error(`Failed to connect to the database \n${err}`);
}

function limiter_middleware(req, res, next) {
    const ip = req.ip;
    const current_time = Date.now();
    let current_usage = 0;

    if (req.method === "GET") {
        next();
        return;
    }

    if (!req_counts.has(ip)) {
        req_counts.set(ip, {
            count: 1,
            last_req_time: current_time,
        });
    }
    else {
        const record = req_counts.get(ip);

        if (record.count >= max_requests_per_IP && current_time - record.last_req_time < rate_limit_duration) {
            return res.status(409).json({error: "Too many requests. Please try again later."});
        }

        if (current_time - record.last_req_time >= rate_limit_duration) {
            record.count = 1;
            record.last_req_time = current_time;
        }
        else {
            record.count ++;
        }

        current_usage = record.count;
        req_counts.set(ip, record);
    }

    if (current_usage === Math.floor(max_requests_per_IP / 2)){
        const remainingRequests = max_requests_per_IP - current_usage;
        res.set("X-RateLimit-Warning", remainingRequests);
    }
    
    next();
}