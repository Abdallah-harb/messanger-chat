require('dotenv').config()
 const express = require('express')
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const corsMiddleware = require('./middleware/corsMiddleware');
const connectDB = require('./config/connection');
const app = express();
const server = createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});
 const port = process.env.APP_PORT;
 const apiRoute = require('./route/apiRoute');
 const path = require('path');
app.set('io', io); // Make io accessible globally
// to avoid circular dependency
require('./socket')(io);
require('./Helpier/response');

 connectDB;
//
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 corsMiddleware(app);
 app.use('/storage', express.static(path.join(__dirname,'storage')));
 app.use('/api',apiRoute);
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found',
    });
});

server.listen(port, () => {
    console.log(`app listening on port ${port}`)
})