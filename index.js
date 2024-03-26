const express=require('express');
const app=express();
const PORT=8001;
const urlRoute=require('./routes/url');
const {mongoInit}=require('./connect');
const databaseName='urldb';
mongoInit(`mongodb://127.0.0.1:27017/${databaseName}`);

app.use(express.json());

app.use('/url',urlRoute);

app.listen(PORT,()=>console.log(`Server Started on http://localhost:${PORT}`));