
// const debug = require('debug')('ournet-places-data');

import { HourlyReportModel, DetailsReportModel } from './db/models';
import { RepAccessOptions, RepUpdateOptions, RepUpdateData } from '@ournet/domain';
import { ReportData, IReportRepository } from '@ournet/weather-domain';
import { DynamoReportStorage } from './DynamoReportStorage';



export class ReportRepository implements IReportRepository {
    // for tests
    [name: string]: any

    constructor(private storage: IReportRepository) { }

    getById(id: string, options?: RepAccessOptions<ReportData>): Promise<ReportData> {
        return this.storage.getById(id, options);
    }
    getByIds(ids: string[], options?: RepAccessOptions<ReportData>): Promise<ReportData[]> {
        return this.storage.getByIds(ids, options);
    }
    exists(id: string): Promise<boolean> {
        return this.storage.exists(id);
    }
    put(data: ReportData): Promise<ReportData> {
        return this.storage.put(data);
    }
    delete(id: string): Promise<boolean> {
        return this.storage.delete(id);
    }
    create(data: ReportData, options?: RepAccessOptions<ReportData>): Promise<ReportData> {
        return this.storage.create(data, options);
    }
    update(data: RepUpdateData<ReportData>, options?: RepUpdateOptions<ReportData>): Promise<ReportData> {
        return this.storage.update(data, options);
    }
}


export class HourlyReportRepository extends ReportRepository {
    constructor() {
        super(new DynamoReportStorage(HourlyReportModel))
    }
}


export class DetailsReportRepository extends ReportRepository {
    constructor() {
        super(new DynamoReportStorage(DetailsReportModel))
    }
}
