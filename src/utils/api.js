import axios from "axios";
import { apiUrl, orgId } from "../configs/app";
import { getOrganizationIdFromUrl } from "./org-helper";

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use(
  (config) => {
    // dynamic org from URL takes precedence over config
    const dynamicOrgId = getOrganizationIdFromUrl();
    // Use the header name specified in the plan: X-Organization-ID
    // You can also pass the organization_id in the body if needed, but header is cleaner for middleware
    config.headers["X-Organization-ID"] = dynamicOrgId || orgId;

    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
