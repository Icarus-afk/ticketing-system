import express from 'express';
import bodyParser from 'body-parser';
import mongoose  from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/users.js';

import dotenv from 'dotenv'
dotenv.config()


const app = express(); //initialize express instance

// setting up body parser
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))

//setting up cors
app.use(cors())

app.use('/user', userRoutes)

const MONGO_STRING = process.env.MONGO_STRING
const PORT = process.env.PORT || 8000;

//connecting to Mongodb
mongoose.connect(String(MONGO_STRING))
    .then(() => app.listen(PORT, () => console.log(`Server running on port = ${PORT}`)))
    .catch((error) => console.log (`Error Occured ---> ${error.message}`))

// mongoose.set('useFindAndModify', false);