const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const ApplicationSchema = new Schema({
    name:               { type: String, required: true },
    created_at:         { type: Date, default: Date.now },
    updated_at:         { type: Date }
});

ApplicationSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Application', ApplicationSchema);
