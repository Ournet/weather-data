
const vogels = require('vogels');
const AWS = vogels.AWS;
import { MODEL_NAMES, getModel } from './models';

export function db(dynamodb: any) {
    MODEL_NAMES.forEach(name => {
        getModel(name).config({
            dynamodb: dynamodb
        });
    });
}

export function config(options: any) {
    db(new AWS.DynamoDB(options));
}