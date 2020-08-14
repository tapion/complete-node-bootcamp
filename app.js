const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./4-natours/starter/routes/tourRoutes');
const userRouter = require('./4-natours/starter/routes/userRoutes');

const app = express();
app.use(express.json()); //Middleware, para poder usar el body de la transaccion
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));    
}
app.use(express.static('./4-natours/starter/public'));
// app.use((req,res,next) =>{
//     req.timeRequest = new Date().toISOString();
//     next();
// })

app.use('/api/v1/users',userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;