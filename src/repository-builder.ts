import DynamoDB = require('aws-sdk/clients/dynamodb');
import { ReportRepository } from '@ournet/weather-domain';
import { DynamoReportRepository } from './dynamo-report-repository';


export class ForecastReportRepositoryBuilder {
    static build(client: DynamoDB.DocumentClient, tableSuffix: string = 'v0'): ReportRepository {
        return new DynamoReportRepository(client, tableSuffix);
    }
}
