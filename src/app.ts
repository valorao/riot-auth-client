import express from "express";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import { routes } from "./routes/routes";
import { headersMiddleware } from "./middlewares/SetHeaders";
import PublicRedirect from "./controllers/PublicRedirect";

const port = process.env.PORT || 5110;
const agent = process.env.AGENT || 'valorao-api';
const version = process.env.VERSION || 'v1';

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'https://t1.rtrampox.cloud', 'https://t2.rtrampox.cloud',
     'htpps://valorao.cloud', 'https://account.valorao.cloud',
      'https://apis.valorao.cloud'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }));

app.use(cookieParser());
app.get('/account', PublicRedirect.index)
app.use(headersMiddleware)
app.use('/account', express.static(path.join(__dirname, 'public')))
app.use(express.json());


app.use('/v1/riot', routes)

app.listen(port, () => {
    console.log(`${agent}/${version}`)
    console.log(`Server is running on port ${port}`)
});
