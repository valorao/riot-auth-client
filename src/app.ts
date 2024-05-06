import express from "express";
import { router } from "./routes/routes";
import { player_router } from "./routes/player-route";
import { DodgeQueueRouter } from "./routes/dodgeQueueRoute";

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/riot', router);
app.use('/api/riot/dev/', player_router)
app.use('/api/riot', DodgeQueueRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});