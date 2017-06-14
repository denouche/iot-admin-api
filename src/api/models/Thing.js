const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const ThingSchema = new Schema({
    name:               { type: String, required: true },
    created_at:         { type: Date, default: Date.now },
    updated_at:         { type: Date }
});

ThingSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Thing', ThingSchema);
