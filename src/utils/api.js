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
    config.headers["X-Organization-ID"] = dynamicOrgId;

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 403 ||
        error.response.data?.error === "ORG_DISABLED")
    ) {
      localStorage.removeItem("organization_settings");
      localStorage.removeItem("org_settings_last_update");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.dispatchEvent(
        new CustomEvent("org-disabled", {
          detail: {
            message:
              error.response.data?.message ||
              "ระบบขององค์กรนี้ถูกระงับการใช้งานชั่วคราว",
          },
        }),
      );
    }
    return Promise.reject(error);
  },
);

export default api;
