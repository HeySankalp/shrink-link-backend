const express = require('express');
const  bp = require("body-parser");
const port = 5000 || process.env.PORT;
const Urls = require('./models/Urls');
const connectToMongoDB = require('./dbconnection');
const cors = require('cors');




connectToMongoDB();
const app = express();
app.use(bp.json());
app.use(cors({
    origin: '*'
}));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.status(200).send('Machine working fine 🙂');
});


//   \---------------------------------------------------------------------/
//    \---Route to create a new short url return orl if already existed---/
//     \-----------------------------------------------------------------/
app.post('/short', async (req, res) => {
    const existedUrl = await Urls.findOne({ full: req.body.full });
    if (existedUrl) {
        const shrinkedlink = req.protocol + '://' + req.get('host') + '/' + existedUrl.short
        res.status(200).send({
            "success": "short url existed and served",
            "url": shrinkedlink
        })
    } else {
        await Urls.create({
            full: req.body.full,
        }).then((url) => {
            const shrinkedlink = req.protocol + '://' + req.get('host') + '/' + url.short
            res.status(200).send({
                "success": "short url created",
                "url": shrinkedlink
            })
        }
        ).catch((err) => {
            console.log(err.PORT, err);
        })
    }
});


//  \----------------------------------------------------------------------------------------------/
//   \----Route to check if short url exist then redirect to the url notify to user if invalid----/
//    \ -----------------------------------------------------------------------------------------/
app.get('/:shortlink', async (req, res) => {
    Urls.findOne({ short: req.params.shortlink })
        .then((url) => {
            res.redirect(url.full);
        }).catch((err) => {
            console.log(req);
            const invalidPageLink = 'https://lrinks.web.app/invalid';
            res.redirect(invalidPageLink);
        })
});

app.listen(port, () => {
    console.log("⚡server is runningon port " + port);
});
