import { generateEnterpriseReport } from "../report/enterpriseReport";
import { API_BASE_URL } from "./api";
export function generateExecutiveReport(data = {}) {
  generateEnterpriseReport(data);
}