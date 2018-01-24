
// const debug = require('debug')('weather-data');

import { RepAccessOptions, RepUpdateData, RepUpdateOptions } from '@ournet/domain';
import { ReportData, IReportRepository } from '@ournet/weather-domain';
import { ReportDataMapper } from './mappers/ReportDataMapper';
import { checkParam, accessOptionsToDynamoParams } from './helpers';

export class DynamoReportStorage implements IReportRepository {
    constructor(private model: any) { }

    delete(id: string): Promise<boolean> {
        try {
            checkParam(id, 'id', 'string');
        } catch (e) {
            return Promise.reject(e);
        }

        return new Promise((resolve, reject) => {
            this.model.destroy(id, (error: Error) => {
                if (error) {
                    return reject(error);
                }
                resolve(true);
            });
        });
    }
    getById(id: string, options?: RepAccessOptions<ReportData>): Promise<ReportData> {
        try {
            checkParam(id, 'id', 'string');
        } catch (e) {
            return Promise.reject(e);
        }

        return new Promise((resolve, reject) => {
            const params = accessOptionsToDynamoParams<ReportData>(options);

            this.model.get(id, params, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(getReportData(result));
            });
        });
    }
    getByIds(ids: string[], options?: RepAccessOptions<ReportData>): Promise<ReportData[]> {
        try {
            checkParam(ids, 'ids', 'array');
        } catch (e) {
            return Promise.reject(e);
        }

        return new Promise<ReportData[]>((resolve, reject) => {
            const params = accessOptionsToDynamoParams<ReportData>(options);

            this.model.getItems(ids, params, (error: Error, result: any[]) => {
                if (error) {
                    return reject(error);
                }
                resolve(result && result.map(getReportData) || []);
            });
        })
            .then(items => {
                if (!items || !items.length) {
                    return [];
                }
                return items.reduce((list, place) => {
                    const i = ids.indexOf(place.id);
                    list[i] = place;
                    return list;
                }, [] as ReportData[]).filter(item => !!item);
            });
    }
    exists(id: string): Promise<boolean> {
        try {
            checkParam(id, 'id', 'string');
        } catch (e) {
            return Promise.reject(e);
        }

        return new Promise((resolve, reject) => {
            this.model.get(id, { AttributesToGet: ['id'] }, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }

                resolve(!!result);
            });
        });
    }
    put(data: ReportData): Promise<ReportData> {
        return new Promise((resolve, reject) => {
            const params = accessOptionsToDynamoParams<ReportData>({});
            params.overwrite = false;

            const dataPlace = ReportDataMapper.transform(data);

            // debug('creating place: ', dataPlace);

            this.model.create(dataPlace, params, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(getReportData(result));
            });
        });
    }
    create(data: ReportData, options?: RepAccessOptions<ReportData>): Promise<ReportData> {
        return new Promise((resolve, reject) => {
            const params = accessOptionsToDynamoParams<ReportData>(options);
            params.overwrite = false;

            const dataPlace = ReportDataMapper.transform(data);

            // debug('creating place: ', dataPlace);

            this.model.create(dataPlace, params, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(getReportData(result));
            });
        });
    }
    update(data: RepUpdateData<ReportData>, options?: RepUpdateOptions<ReportData>): Promise<ReportData> {
        return new Promise((resolve, reject) => {
            const params = accessOptionsToDynamoParams<ReportData>(options);
            params.expected = { id: data.item.id };

            let dataPlace: any = <ReportData>Object.assign({}, data.item);// DataPlaceMapper.transform(data.item);

            if (data.delete && data.delete.length) {
                data.delete.forEach(item => dataPlace[item] = null);
            }

            dataPlace = ReportDataMapper.transform(dataPlace);

            this.model.update(dataPlace, params, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(getReportData(result));
            });
        });
    }
}

function getReportData(data: any): ReportData {
    if (!data) {
        return null;
    }
    const report = <ReportData>data.get();
    if (!report) {
        return report;
    }
    if (report.createdAt) {
        report.createdAt = new Date(report.createdAt);
    }
    if (report.expiresAt) {
        report.expiresAt = new Date(report.expiresAt);
    }

    return report;
}
