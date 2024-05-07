import express from "express";
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import { player_router } from "./routes/PlayerInfoRoute";
import { ClientInfo_Router } from "./routes/RiotClientInfo";
import { headersMiddleware } from "./middlewares/SetHeaders";

const app = express();
app.use(headersMiddleware)
app.use(cookieParser());
const port = process.env.PORT || 5110;

app.use(express.json());
app.use('/v1/riot', player_router)
app.use('/v1/riot', ClientInfo_Router)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});