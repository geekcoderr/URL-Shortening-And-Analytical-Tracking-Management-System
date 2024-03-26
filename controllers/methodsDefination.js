const shortIds=require('shortid');
const URL=require('../models/urlSchamea');

async function GenerateNewShortURL(req,res){
    const body=req.body;
    if(!body.url){
        return res.status(400).json({error:"Url field is required"});
    };
    const shortid=shortIds();
    await URL.create({
        shortId:shortid,
        redirectUrl:body.url,
        visitHistory:[],
    });
    return res.json({ id: shortid });
};


module.exports={
    GenerateNewShortURL,
};