import express, { Request, Response } from "express";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

import { player_router } from "./routes/PlayerInfoRoute";
import { ClientInfo_Router } from "./routes/RiotClientInfo";
import { headersMiddleware } from "./middlewares/SetHeaders";

const port = process.env.PORT || 5110;
const agent = process.env.AGENT || 'valorao-api';
const version = process.env.VERSION || 'v1';

const corsOptions = {
    allowedHeaders: 'password,username,remember'
}

const app = express();
app.use(headersMiddleware)
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.json());

app.use('/v1/riot', player_router)
app.use('/v1/riot', ClientInfo_Router)

app.listen(port, () => {
    console.log(`${agent}/${version}`)
    console.log(`Server is running on port ${port}`)
});
