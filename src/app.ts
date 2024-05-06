import express from "express";
import { PlayerAuth_router } from "./routes/playerAuthRoute";
import { player_router } from "./routes/PlayerInfoRoute";
import { DodgeQueueRouter } from "./routes/dodgeQueueRoute";
import { ClientInfo_Router } from "./routes/RiotClientInfo";

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/riot', PlayerAuth_router);
app.use('/api/riot', player_router)
app.use('/api/riot', DodgeQueueRouter)
app.use('/api/riot', ClientInfo_Router)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});