const express = require('express');
const Urls = require('./models/Urls');
const connectToMongoDB = require('./dbconnection');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
dotenv.config();
connectToMongoDB();
const app = express();


app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

const port = process.env.PORT || 8000;



app.use('/', (req, res) => {
    res.status(200).send('Machine working properly ⚡');
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
            const invalidPageLink = 'https://lrinks.web.app/invalid';
            res.redirect(invalidPageLink);
        })
});



app.listen(port, () => {
    console.log("⚡server is runningon port " + port);
});
