const mongoose = require('mongoose');
const express = require('express');
const ShortUrl = require('./models/shortUrl');
const shortUrl = require('./models/shortUrl');

const app = express();
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology : true,
}).then(() => {
    console.log("Database connected");
}).catch((error) => {
    console.log("something happened");
    console.log(error);
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.get('/',async (req, res)=>{
    console.log("server started");
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls});
})
app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({full : req.body.fullUrl});
    res.redirect('/');
})
app.get('/:shortUrl', async (req,res) => {
    const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl});
    if(shortUrl == null) return res.sendStatus(404)
    console.log(shortUrl);
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
})

app.listen(process.env.PORT);