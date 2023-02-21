const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

function connectToMongoDB() {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("DB connected 👍");

    }).catch((err) => {
        console.log(err.message);
    })
}

module.exports = connectToMongoDB;

// mongodb+srv://sankalpsachan:raftaar1999sankalp@cluster0.7euvz.mongodb.net/link-shrink?retryWrites=true&w=majority