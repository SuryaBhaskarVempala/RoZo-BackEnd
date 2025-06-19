const mongoose = require('mongoose');

function connection(url){
    mongoose.connect(url)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB:', err);
        });
}

module.exports = connection;