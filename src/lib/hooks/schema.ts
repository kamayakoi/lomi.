import { z } from 'zod';

export const changeChartTypeSchema = z.enum(['line', 'bar', 'area']);
export type ChartType = z.infer<typeof changeChartTypeSchema>;

export const changeChartPeriodSchema = z.enum(['24H', '7D', '1M', '3M', '6M', 'YTD']);
export type ChartPeriod = z.infer<typeof changeChartPeriodSchema>; 