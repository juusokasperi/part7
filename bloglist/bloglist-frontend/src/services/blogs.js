import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data.sort((blog1, blog2) => blog2.likes - blog1.likes);
};

const getComments = async (blogId) => {
  const response = await axios.get(`${baseUrl}/${blogId}/comments`);
  return response.data;
};

const comment = async (newObject) => {
  const response = await axios.post(`${baseUrl}/${newObject.id}/comments`, {
    content: newObject.content,
  });
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const like = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const likedObject = { ...newObject, likes: newObject.likes + 1 };
  const response = await axios.put(
    `${baseUrl}/${newObject.id}`,
    likedObject,
    config,
  );
  return response.data;
};

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return id;
};

export default {
  getAll,
  getComments,
  comment,
  create,
  like,
  update,
  remove,
  setToken,
};
