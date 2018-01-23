
const vogels = require('vogels');
import { MODEL_NAMES } from './models';

export function createTables() {
    const data: { [name: string]: any } = {};
    const options = {
        readCapacity: 1,
        writeCapacity: 1
    };

    MODEL_NAMES.forEach(function (modelName) {
        data[modelName] = options;
    });

    return new Promise(function (resolve, reject) {
        vogels.createTables(data, function (err: Error) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};