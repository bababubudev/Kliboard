import { allowedOrigins } from "./allowedOrigins.js";

export const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null);
            console.error("Not allowed by cors!");
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}; 