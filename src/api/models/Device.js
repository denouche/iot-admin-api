const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const DeviceSchema = new Schema({
    mac:                { type: String, required: true },
    name:               { type: String },
    _thing:             { type: Schema.Types.ObjectId, ref: 'Thing' },
    created_at:         { type: Date, default: Date.now },
    updated_at:         { type: Date },
    plateform:          { type: String, enum: ['esp8266', 'raspberry'] },
    ssid:               { type: String },
    ip:                 { type: String },
    _application:       { type: Schema.Types.ObjectId, ref: 'Application' },
    _version:           { type: Schema.Types.ObjectId, ref: 'Version' }

});

module.exports = mongoose.model('Device', DeviceSchema);
