
const vogels = require('vogels');

import { ReportSchema } from './schemas';

const PREFIX = process.env.OURNET_WEATHER_TABLE_PREFIX || 'v0';

export const MODEL_NAMES = ['HourlyReport', 'DetailsReport'];

export const HourlyReportModel = vogels.define('HourlyReport', {
    tableName: [PREFIX, 'OurnetWeather', 'HourlyReports'].join('_'),
    hashKey: 'id',
    schema: ReportSchema,
    timestamps: false,
});

export const DetailsReportModel = vogels.define('DetailsReport', {
    tableName: [PREFIX, 'OurnetWeather', 'DetailsReports'].join('_'),
    hashKey: 'id',
    schema: ReportSchema,
    timestamps: false,
});

export function getModel(name: string) {
    switch (name) {
        case 'HourlyReport': return HourlyReportModel;
        case 'DetailsReport': return DetailsReportModel;
    }
    throw new Error('Invalid model name ' + name);
}
