
import DynamoDB = require('aws-sdk/clients/dynamodb');
import { ReportData } from "@ournet/weather-domain";
import {
    DynamoItem,
} from 'dynamo-item';

export class ForecastReportModel extends DynamoItem<{ id: string }, ReportData> {
    constructor(client: DynamoDB.DocumentClient, tableSuffix: string) {
        super({
            hashKey: {
                name: 'id',
                type: 'S'
            },
            name: 'forecast_reports',
            tableName: `ournet_forecast_reports_${tableSuffix}`,
        }, client as any);
    }
}
