
// const debug = require('debug')('ournet:weather-data');

import DynamoDB = require('aws-sdk/clients/dynamodb');
import {
    BaseRepository,
    RepositoryUpdateData,
    RepositoryAccessOptions,
} from '@ournet/domain';


import { ForecastReportModel } from './forecast-report';
import { sortEntitiesByIds } from './helpers';
import { ReportData, ReportRepository, ReportDataValidator } from '@ournet/weather-domain';

export class DynamoReportRepository extends BaseRepository<ReportData> implements ReportRepository {
    protected model: ForecastReportModel

    constructor(client: DynamoDB.DocumentClient, tableSuffix: string) {
        super(new ReportDataValidator());
        this.model = new ForecastReportModel(client, tableSuffix);
    }

    async put(data: ReportData) {
        data = this.beforeCreate(data);
        return await this.model.put(data);
    }

    async innerCreate(data: ReportData) {
        return await this.model.create(data);
    }

    async innerUpdate(data: RepositoryUpdateData<ReportData>) {
        return await this.model.update({
            remove: data.delete,
            key: { id: data.id },
            set: data.set
        });
    }

    async delete(id: string) {
        const oldItem = await this.model.delete({ id });
        return !!oldItem;
    }

    async exists(id: string) {
        const item = await this.getById(id, { fields: ['id'] });

        return !!item;
    }

    async getById(id: string, options?: RepositoryAccessOptions<ReportData>) {
        return await this.model.get({ id }, options && { attributes: options.fields });
    }

    async getByIds(ids: string[], options?: RepositoryAccessOptions<ReportData>) {
        const items = await this.model.getItems(ids.map(id => ({ id })), options && { attributes: options.fields });

        return sortEntitiesByIds(ids, items);
    }

    async deleteStorage(): Promise<void> {
        await Promise.all([
            this.model.deleteTable(),
        ]);
    }
    async createStorage(): Promise<void> {
        await Promise.all([
            this.model.createTable(),
        ]);
    }
}
