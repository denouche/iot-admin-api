const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const VersionSchema = new Schema({
    name:               { type: String },
    plateform:          { type: String, enum: ['esp8266', 'raspberry'], required: true },
    _application:       { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    created_at:         { type: Date, default: Date.now },
    firmware:           { data: Buffer }
});

VersionSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.firmware;
  delete obj.__v;
  delete obj._application.__v;
  return obj;
};

module.exports = mongoose.model('Version', VersionSchema);

/*
var fs = require('fs');

var imgPath = '/home/denouche/tmp/cat.jpg';

// Write
var version = new Version();
version.firmware.data = fs.readFileSync(imgPath);

// Read
server.get('/', function (req, res, next) {
        A.findById(a, function (err, doc) {
          if (err) return next(err);
          res.contentType(doc.img.contentType);
          res.send(doc.img.data);
        });
      });


*/