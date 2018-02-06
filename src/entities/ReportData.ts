
import { ForecastUnits } from '@ournet/weather-domain';

export interface DataReportData {
    id: string;
    createdAt?: Date;
    expiresAt?: number;
    units?: ForecastUnits;
    data: string;
}
