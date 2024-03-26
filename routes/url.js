const express  = require('express');
const router=express.Router();
const {GenerateNewShortURL}=require('../controllers/methodsDefination')

router.post('/',GenerateNewShortURL);

module.exports=router;