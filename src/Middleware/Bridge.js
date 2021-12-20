import { ACCESS_POINT } from '../config';
import http from "./http";
const Authorization = localStorage.getItem('token');
const roles = localStorage.getItem('roles') !== null ? JSON.parse(localStorage.getItem('roles')) : null;

///User

const userLogin = async (formdata, callback) => {
   await http.post(ACCESS_POINT + `/user/login`, formdata, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (response) => {
    console.log(response);
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
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

const getUserRole = async (callback) => {
  const result = await http.get(ACCESS_POINT + `/user/get-roles`, {
    headers: {
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const addUserRole = async (formdata,callback) => {
  const result = await http.post(ACCESS_POINT + `/user`,formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const updateUserRole = async (formdata,callback) => {
  const result = await http.patch(ACCESS_POINT + `/user`,formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const deleteUser = async (formdata, callback) => {
  const result = await http.delete(ACCESS_POINT + `/user/${formdata._id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
    data: formdata
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const getUserData = async (roleId='',callback) => {
  const result = await http.get(ACCESS_POINT + `/user${roleId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const getProfile = async () => {
  const result = await http.get(ACCESS_POINT + `/user/profile`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  });
  return result;
};

const updateProfile = async (formdata) => {
  const result = await http.patch(ACCESS_POINT + `/user/profile`, formdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': Authorization
    },
  });
  return result;
}

//Department

const addDepartment = async (formdata,callback) => {
  const result = await http.post(ACCESS_POINT + `/department`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const getDepartments = async (callback) => {
  await http.get(ACCESS_POINT + `/department`, {
    headers: {
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const editDepartment = async (formdata,callback) => {
  const result = await http.patch(ACCESS_POINT + `/department`,formdata, {
    headers: {
      'Authorization': Authorization,
      'Content-Type': 'application/json',
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const deleteDepartment = async (formdata,callback) => {
  const result = await http.delete(ACCESS_POINT + `/department/${formdata._id}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
    data:formdata
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

//Store 

const getStores = async (callback) => {
  await http.get(ACCESS_POINT + `/user/store`, {
    headers: {
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const addStore = async (formdata,callback) => {
  const result = await http.post(ACCESS_POINT + `/user/store`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const editStore = async (formdata,callback) => {
  const result = await http.patch(ACCESS_POINT + `/user/store`,formdata, {
    headers: {
      'Authorization': Authorization,
      'Content-Type': 'application/json',
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const deleteStore = async (formdata,callback) => {
  const result = await http.delete(ACCESS_POINT + `/user/store/${formdata._id}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
    data:formdata
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}


////Worker

const getWorker = async (query=null,callback) => {
  const result = await http.get(ACCESS_POINT + `/user/worker${query?query:''}`, {
    headers: {
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const addWorker = async (formdata,callback) => {
  const result = await http.post(ACCESS_POINT + `/user/worker`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const editWorker = async (formdata,callback) => {
  const result = await http.patch(ACCESS_POINT + `/user/worker`,formdata, {
    headers: {
      'Authorization': Authorization,
      'Content-Type': 'application/json',
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const deleteWorker = async (formdata,callback) => {
  const result = await http.delete(ACCESS_POINT + `/user/worker/${formdata._id}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
    data:formdata
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

///tickets

const addTicket = async (formdata,callback) => {
  const result = await http.post(ACCESS_POINT + `/ticket`, formdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const assignTicket = async (formdata, callback) => {
  await http.post(ACCESS_POINT + `/ticket/assign`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const cancelAssignTicket = async (formdata,callback) => {
  const result = await http.post(ACCESS_POINT + `/ticket/re-open`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const cancelClosedTicket = async (formdata,callback) => {
  const result = await http.post(ACCESS_POINT + `/ticket/re-assign`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const closeAssignTicket = async (formdata,callback) => {
  const result = await http.post(ACCESS_POINT + `/ticket/close`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const getTicket = async (query = null, callback) => {
  const result = await http.get(ACCESS_POINT + `/ticket${query ? query : ''}`, {
    headers: {
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const deleteTicket = async (formdata,callback) => {
  const result = await http.delete(ACCESS_POINT + `/ticket/${formdata._id}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
    data:formdata
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

///// performance
const getEvaluation = async (query=null,callback) => {
  const result = await http.get(ACCESS_POINT + `/ticket/evaluation`, {
    headers: {
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}

const postEvaluation = async (formdata,callback) => {
  const result = await http.post(ACCESS_POINT + `/ticket/evaluation`, formdata, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
}
////// dashboard

const getDashboard = async (callback) => {
  const result = await http.get(ACCESS_POINT + `/user/dashboard`, {
    headers: {
      'Authorization': Authorization
    },
  }).then(async (response) => {
    callback(response);
  })
    .catch(function (error) {
      if (error.response) {
        callback({ status: error.response.status, message: error.response.data?.error })
      }
    })
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
  deleteTicket,
  assignTicket,
  cancelAssignTicket,
  closeAssignTicket,
  getEvaluation,
  postEvaluation,
  getProfile,
  updateProfile,
  cancelClosedTicket,
  getDashboard
}