const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const DeviceSchema = new Schema({
    name:               { type: String },
    mac:                { type: String, required: true },
    ssid:               { type: String },
    ip:                 { type: String },
    last_register:      { type: Date },
    plateform:          { type: String, enum: ['esp8266', 'raspberry'] },
    created_at:         { type: Date, default: Date.now },
    updated_at:         { type: Date },
    _thing:             { type: Schema.Types.ObjectId, ref: 'Thing' },
    _application:       { type: Schema.Types.ObjectId, ref: 'Application' },
    _version:           { type: Schema.Types.ObjectId, ref: 'Version' }
});

DeviceSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.__v;
    
    if(obj._thing) {
        delete obj._thing.__v;
    }
    
    if(obj._application) {
        delete obj._application.__v;
    }
    
    if(obj._version) {
        delete obj._version.__v;
        delete obj._version._application;
        delete obj._version.firmware;
    }
    return obj;
};

module.exports = mongoose.model('Device', DeviceSchema);
