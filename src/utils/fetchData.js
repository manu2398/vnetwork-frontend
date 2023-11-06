// import axios from "axios";

import create from "./apiService";

export const getDataAPI = async (url, token) => {
  const res = await create.get(`/api/${url}`, {
    headers: { Authorization: `${token}` },
  });
  return res;
};

export const postDataAPI = async (url, post, token) => {
  const res = await create.post(`/api/${url}`, post, {
    headers: { Authorization: `${token}` },
  });
  return res;
};

export const putDataAPI = async (url, post, token) => {
  const res = await create.put(`/api/${url}`, post, {
    headers: { Authorization: `${token}` },
  });
  return res;
};

export const patchDataAPI = async (url, post, token) => {
  const res = await create.patch(`/api/${url}`, post, {
    headers: { Authorization: `${token}` },
  });
  return res;
};

export const deleteDataAPI = async (url, token) => {
  const res = await create.delete(`/api/${url}`, {
    headers: { Authorization: `${token}` },
  });
  return res;
};
