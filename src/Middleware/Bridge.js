import { ACCESS_POINT } from '../config';
import http from "./http";
const Authorization = localStorage.getItem('token');
const roles = localStorage.getItem('roles') !== null ? JSON.parse(localStorage.getItem('roles')) : null

///User

const userLogin = async (formdata) => {
  const result = await http.post(ACCESS_POINT + `/user/login`, formdata, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}

const userLogOut = async (formdata={}) => {
  const result = await http.post(ACCESS_POINT + `/user/logout`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  });
  return result;
}

const getUserRole = async () => {
  const result = await http.get(ACCESS_POINT + `/user/get-roles`, {
    headers: {
      'Authorization': Authorization
    },
  });
  return result;
}

const addUserRole = async (formdata) => {
  const result = await http.post(ACCESS_POINT + `/user`,formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  });
  return result;
}

const updateUserRole = async (formdata) => {
  const result = await http.patch(ACCESS_POINT + `/user`,formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  });
  return result;
};

const deleteUser = async (formdata) => {
  const result = await http.delete(ACCESS_POINT + `/user/${formdata._id}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
    data:formdata
  });
  return result;
}

const getUserData = async (roleId) => {
  const result = await http.get(ACCESS_POINT + `/user?=${roleId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  });
  return result;
}

//Department

const addDepartment = async (formdata) => {
  const result = await http.post(ACCESS_POINT + `/department`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  });
  return result;
}

const getDepartments = async () => {
  const result = await http.get(ACCESS_POINT + `/department`, {
    headers: {
      'Authorization': Authorization
    },
  });
  return result;
}

const editDepartment = async (formdata) => {
  const result = await http.patch(ACCESS_POINT + `/department`,formdata, {
    headers: {
      'Authorization': Authorization,
      'Content-Type': 'application/json',
    },
  });
  return result;
}

const deleteDepartment = async (formdata) => {
  const result = await http.delete(ACCESS_POINT + `/department/${formdata._id}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
    data:formdata
  });
  return result;
}

//Store 

const getStores = async () => {
  const result = await http.get(ACCESS_POINT + `/user/store`, {
    headers: {
      'Authorization': Authorization
    },
  });
  return result;
}

const addStore = async (formdata) => {
  const result = await http.post(ACCESS_POINT + `/user/store`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  });
  return result;
}

const editStore = async (formdata) => {
  const result = await http.patch(ACCESS_POINT + `/user/store`,formdata, {
    headers: {
      'Authorization': Authorization,
      'Content-Type': 'application/json',
    },
  });
  return result;
}

const deleteStore = async (formdata) => {
  const result = await http.delete(ACCESS_POINT + `/user/store/${formdata._id}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
    data:formdata
  });
  return result;
}


////Worker

const getWorker = async () => {
  const result = await http.get(ACCESS_POINT + `/user/worker`, {
    headers: {
      'Authorization': Authorization
    },
  });
  return result;
}

const addWorker = async (formdata) => {
  const result = await http.post(ACCESS_POINT + `/user/worker`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  });
  return result;
}

const editWorker = async (formdata) => {
  const result = await http.patch(ACCESS_POINT + `/user/worker`,formdata, {
    headers: {
      'Authorization': Authorization,
      'Content-Type': 'application/json',
    },
  });
  return result;
}

const deleteWorker = async (formdata) => {
  const result = await http.delete(ACCESS_POINT + `/user/worker/${formdata._id}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
    data:formdata
  });
  return result;
};

///tickets

const addTicket = async (formdata) => {
  const result = await http.post(ACCESS_POINT + `/ticket`, formdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': Authorization
    },
  });
  return result;
}

const getTicket = async () => {
  const result = await http.get(ACCESS_POINT + `/ticket`, {
    headers: {
      'Authorization': Authorization
    },
  });
  return result;
}

const deleteTicket = async (formdata) => {
  const result = await http.delete(ACCESS_POINT + `/ticket/${formdata._id}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
    data:formdata
  });
  return result;
}

export default {
  userLogin,
  addDepartment,
  getDepartments,
  editDepartment,
  deleteDepartment,
  userLogOut,
  getUserRole,
  addUserRole,
  getUserData,
  updateUserRole,
  deleteUser,
  getStores,
  addStore,
  editStore,
  deleteStore,
  addWorker,
  editWorker,
  getWorker,
  deleteWorker,
  addTicket,
  getTicket,
  deleteTicket
}