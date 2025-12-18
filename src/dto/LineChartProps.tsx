import { ApexOptions } from 'apexcharts';

export interface LineChartProps {
    data: LineChartData | undefined
    loading: Boolean
}

export interface LineChartData {
    options: ApexOptions;
    series: any[];
}
