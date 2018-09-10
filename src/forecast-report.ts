
import DynamoDB = require('aws-sdk/clients/dynamodb');
import { ReportData } from "@ournet/weather-domain";
import {
    DynamoModel,
} from 'dynamo-model';

export class ForecastReportModel extends DynamoModel<{ id: string }, ReportData> {
    constructor(client: DynamoDB.DocumentClient, tableSuffix: string) {
        super({
            hashKey: {
                name: 'id',
                type: 'S'
            },
            name: 'forecast_reports',
            tableName: `ournet_forecast_reports_${tableSuffix}`,
        }, client);
    }
}
