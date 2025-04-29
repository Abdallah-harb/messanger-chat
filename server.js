require('dotenv').config()
 const express = require('express')
 const corsMiddleware = require('./middleware/corsMiddleware');
 const connectDB = require('./config/connection');
 const app = express();
const multer  = require('multer')
 const port = process.env.APP_PORT;
 const apiRoute = require('./route/apiRoute');
 const path = require('path');
//
 connectDB;
//
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
app.use(multer().none());
 corsMiddleware(app);
 app.use('/storage', express.static(path.join(__dirname,'storage')));
 app.use('/api',apiRoute);
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found',
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})