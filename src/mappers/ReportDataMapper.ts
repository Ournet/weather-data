
import { ReportData } from '@ournet/weather-domain';
import { DataReportData } from '../entities';

export class ReportDataMapper {
    static toData(source: ReportData): DataReportData {
        if (!source) {
            return null;
        }
        return {
            id: source.id,
            createdAt: source.createdAt,
            expiresAt: source.expiresAt && Math.floor(source.expiresAt.getTime() / 1000),
            data: source.data,
            units: source.units,
        };
    }

    static allToData(sources: ReportData[]): DataReportData[] {
        return sources.map(ReportDataMapper.toData);
    }

    static fromData(source: DataReportData): ReportData {
        if (!source) {
            return null;
        }
        const data = {
            id: source.id,
            createdAt: source.createdAt,
            expiresAt: source.expiresAt && new Date(source.expiresAt * 1000),
            data: source.data,
            units: source.units,
        };

        for (var prop in data) {
            if (~[null, undefined].indexOf((<any>data)[prop])) {
                delete (<any>data)[prop]
            }
        }

        return data;
    }
}
