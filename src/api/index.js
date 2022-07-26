import axios from "axios";

const BASE_URL = "https://api-dev.emporix.io";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((request) => {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const { headers } = request;
  if (headers) {
    headers.Authorization = `Bearer ${accessToken}`;
    headers["Accept-Language"] = "*";
    headers["Content-Language"] = "*";
  }
  return request;
});

export const getSites = async () => {
  const tenant = JSON.parse(localStorage.getItem("tenant"));
  const resp = await api.get(`/site/${tenant}/sites`);
  return resp.data;
};

export const getSite = async (code) => {
  const tenant = JSON.parse(localStorage.getItem("tenant"));
  const resp = await api.get(`/site/${tenant}/sites/${code}`);
  return resp.data;
};

export const updateSite = async (code, site) => {
  const tenant = JSON.parse(localStorage.getItem("tenant"));
  const resp = await api.patch(`/site/${tenant}/sites/${code}`, { ...site });
  return resp.data;
};
