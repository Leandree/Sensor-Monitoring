const { Service } = require('feathers-mongoose');

exports.Messages = class Messages extends Service {

    constructor(option, app) {
        super(option);
        this.app = app;
    }
    async create(message) {
        this.Model.create(message);
    }
};
