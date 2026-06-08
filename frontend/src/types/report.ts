import { SimulationInput, CompareSimulationsInput } from "./simulation";

export type ReportExportRequest = {
  title: string;
  description?: string;
  simulation?: SimulationInput;
  comparison?: CompareSimulationsInput;
  include_daily_results?: boolean;
  include_assumptions?: boolean;
  include_limitations?: boolean;
};

export type JsonReportResponse = {
  filename: string;
  content_type: string;
  data: any;
};

export type TextReportResponse = {
  filename: string;
  content_type: string;
  content: string;
};
