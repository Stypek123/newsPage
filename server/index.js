import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(bodyParser.json())
app.use(cors());

import announcements from './routes/api/announcements.js'
import users from './routes/api/users.js'

app.use('/api/announcements', announcements)
app.use('/api/users', users)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Hi, I'm runnig! port: ${port}`));