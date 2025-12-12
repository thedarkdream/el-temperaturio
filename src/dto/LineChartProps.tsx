import type { ChartData, ChartOptions } from 'chart.js';

export interface LineChartProps {
    data: LineChartData | undefined
    loading: Boolean
}

export interface LineChartData {
    options: ChartOptions<'line'>;
    data: any;
}
