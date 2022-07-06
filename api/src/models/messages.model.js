// messages-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html

// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'messages';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    rssi: { type: Number, required: true },
    temp1: { type: Number, required: true },
    temp2: { type: Number, required: true },
    relativeHumidity: { type: Number, required: true },
    airPressure: { type: Number, required: true },
    device: { type: String, required: true },
    relay: { type: String, required: true }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
