const users = require('./users/users.service.js');
const messages = require('./messages/messages.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(messages);

  app.post('/callback', (e) => {
    const imei = e.body.imei;
    Object.entries(e.body.devices).map(oneDevice => {
      let message = {
        rssi: oneDevice[1].rssi,
        temp1: null,
        temp2: null,
        relativeHumidity: null,
        airPressure: null,
        device: oneDevice[0],
        relay: imei
      };
      let data = oneDevice[1].data.match(/.{1,2}/g);
      message.airPressure = parseInt(data[26].concat(data[25]), 16);
      message.relativeHumidity = (parseInt(data[24].concat(data[23]), 16) / 100);
      message.temp2 = (parseInt(data[22].concat(data[21]), 16) / 100);
      message.temp1 = (parseInt(data[20].concat(data[19]), 16) / 100);
      app.service('messages').create(message);
    });
  });
};
