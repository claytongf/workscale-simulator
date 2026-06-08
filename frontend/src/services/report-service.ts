import { apiFetch } from "./api";
import {
  ReportExportRequest,
  JsonReportResponse,
  TextReportResponse,
} from "../types/report";

export const reportService = {
  exportJson(payload: ReportExportRequest): Promise<JsonReportResponse> {
    return apiFetch<JsonReportResponse>("/api/reports/export/json", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  exportCsv(payload: ReportExportRequest): Promise<TextReportResponse> {
    return apiFetch<TextReportResponse>("/api/reports/export/csv", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  exportMarkdown(payload: ReportExportRequest): Promise<TextReportResponse> {
    return apiFetch<TextReportResponse>("/api/reports/export/markdown", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
