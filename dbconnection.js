const mongoose = require('mongoose');

function connectToMongoDB() {
    mongoose.set('strictQuery', true)
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