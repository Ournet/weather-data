
import { ReportData } from '@ournet/weather-domain';
import { DataReportData } from '../entities';

export class ReportDataMapper {
    static transform(source: ReportData): DataReportData {
        return source;
    }

    static transformAll(sources: ReportData[]): DataReportData[] {
        return sources.map(ReportDataMapper.transform);
    }
}
