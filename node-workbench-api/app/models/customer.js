// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    boss: { type: String, required: false },

    created: Date,
    updated: Date
});

CustomerSchema.virtual('date')
    .get(function () {
        return this._id.getTimestamp();
    });

mongoose.model('Customer', CustomerSchema);

