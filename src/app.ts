import { GetCookies } from "./middlewares/getCookies";
import express from "express";
import { router } from "./routes/routes";

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});




// const getCookies = new GetCookies();
// getCookies.postAuthCookies('85.0.1.1382.3124').then(response => {
//     console.log(response);
// }).catch(error => {
//     console.error(error);
// });