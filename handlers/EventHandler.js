const fs = require('fs');
module.exports = {
    events: [],
    find: function (name) {
        this.events.find(e => e.name.toLowerCase() == name.toLowerCase())
    },
    set: function (name, event) {
        if (!name || !event || !['[object Function]', '[AsyncFunction]', '[object AsyncFunction]'].includes({}.toString.call(event))) return error('Invalid event object.');

        function CallEvent(...args) {
            try {
                event(require('../handlers/VariableHandler').client, ...args);
            } catch (err) {
                console.log(err);
            }
        }

        this.client.on(name, CallEvent);

        const EventObject = {
            name,
            run: event,
            call: CallEvent
        }


        this.events.push(EventObject);
    },
    init: function (client) {
        this.client = client;
        fs.readdir('./events', function (err, files) {
            if (err) throw err;
            files
                .filter(f => f.endsWith('.js'))
                .forEach(event => {
                    module.exports.set(event.split(".js")[0], require('../events/' + event));
                })
            console.log(`${module.exports.events.length}  events have been loaded`);

            return module.exports;
        })
    }
}