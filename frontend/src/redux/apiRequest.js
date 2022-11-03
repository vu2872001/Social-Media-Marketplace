import axios from "axios";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import { apiUrl } from "../common/environment/environment";
import api from "../common/environment/environment";
import {
  createPostFailed,
  createPostStart,
  createPostSuccess,
  deletePostFailed,
  deletePostStart,
  deletePostSuccess,
  getPostByProfileFailed,
  getPostByProfileStart,
  getPostByProfileSuccess,
  getPostFailed,
  getPostStart,
  getPostSuccess,
  likePostFailed,
  likePostStart,
  likePostSuccess,
  updatePostFailed,
  updatePostStart,
  updatePostSuccess,
} from "./post/postSlice";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logOutFailed,
  logOutStart,
  logOutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
  userDataAssign,
} from "./auth/authSlice";
import {
  uploadImagePostFailed,
  uploadImagePostStart,
  uploadImagePostSuccess,
} from "./uploadImage/uploadImageSlice";
import {
  acceptFriendRequestFailed,
  acceptFriendRequestStart,
  acceptFriendRequestSuccess,
  addFriendFailed,
  addFriendStart,
  addFriendSuccess,
  denyFriendRequestFailed,
  denyFriendRequestStart,
  denyFriendRequestSuccess,
  getAllFriendFailed,
  getAllFriendForMainUserFailed,
  getAllFriendForMainUserStart,
  getAllFriendForMainUserSuccess,
  getAllFriendStart,
  getAllFriendSuccess,
  getFriendRequestFailed,
  getFriendRequestStart,
  getFriendRequestSuccess,
  getMutualFriendFailed,
  getMutualFriendStart,
  getMutualFriendSuccess,
} from "./friend/friendSlice";
import {
  getProfileDetailStart,
  getProfileDetailSuccess,
  getProfileDetailFailed,
  getFriendSuggestionFailed,
  getFriendSuggestionStart,
  getFriendSuggestionSuccess,
} from "./profile/profileSlice";
import { axiosInStanceJWT } from "./axiosJWT";

const notify = (message, type) => {
  if (type === "info") {
    toast.info(message, {
      autoClose: 1000,
      hideProgressBar: true,
      position: toast.POSITION.BOTTOM_RIGHT,
      pauseOnHover: false,
      theme: "dark",
    });
  } else if (type === "error") {
    toast.error(message, {
      autoClose: 1000,
      hideProgressBar: true,
      position: toast.POSITION.BOTTOM_RIGHT,
      pauseOnHover: false,
      theme: "dark",
    });
  }
};

export const register = async (model, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    const res = await axios.post(`${apiUrl}/auth/register`, model);
    if (res) {
      dispatch(registerSuccess(res.data));

      navigate("/login");
    } else {
      dispatch(registerFailed());
    }
  } catch (error) {
    dispatch(registerFailed());
  }
};
export const login = async (model, dispatch, navigate, from) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${apiUrl}/auth/login`, model);
    if (res) {
      var token = res.data.access;
      var decoded = jwt_decode(token);
      dispatch(loginSuccess(res.data));
      dispatch(userDataAssign(decoded));
      navigate(from, { replace: true });
    } else {
      dispatch(loginFailed());
    }
  } catch (error) {
    dispatch(loginFailed());
  }
};
export const logOut = async (dispatch, accessToken, refreshToken) => {
  dispatch(logOutStart());
  try {
    const config = {
      Authorization: `Bearer ${accessToken}`,
    };
    const res = await axiosInStanceJWT.post(
      `${apiUrl}/auth/logout`,
      {},
      {
        headers: config,
        ACCESS_PARAM: accessToken,
        REFRESH_PARAM: refreshToken,
      }
    );
    if (!res.data.message) {
      dispatch(logOutSuccess());
    } else {
      dispatch(logOutFailed());
      notify(res.data.message, "error");
    }
  } catch (err) {
    console.log(err);
    dispatch(logOutFailed());
  }
};

export const getRefreshToken = async (dispatch, refreshToken) => {
  dispatch(loginStart());
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    };
    const res = await axios.get(`${apiUrl}/auth/refresh`, config);
    if (!res.data.message) {
      var token = res.data.access;
      var decoded = jwt_decode(token);
      dispatch(loginSuccess(res.data));
      dispatch(userDataAssign(decoded));
    } else {
      dispatch(loginFailed());
      notify(res.data.message, "error");
    }
  } catch (err) {
    console.log(err);
    dispatch(loginFailed());
  }
};
export const takeRefreshToken = async (refreshToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    };
    const res = await axios.get(`${apiUrl}/auth/refresh`, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const createPost = async (accessToken, refreshToken, post, dispatch) => {
  dispatch(createPostStart());
  try {
    const config = {
      Authorization: `Bearer ${accessToken}`,
    };

    const res = await axiosInStanceJWT.post(`${apiUrl}/post/newPost`, post, {
      headers: config,
      ACCESS_PARAM: accessToken,
      REFRESH_PARAM: refreshToken,
    });
    if (!res.data.message) {
      dispatch(createPostSuccess(res.data));
      notify("Post Created", "info");
    } else {
      dispatch(createPostFailed());
      notify(res.data.message, "error");
    }
  } catch (error) {
    console.log(error);
    dispatch(createPostFailed());
  }
};
export const updatePost = async (
  accessToken,
  refreshToken,
  updatePost,
  dispatch
) => {
  dispatch(updatePostStart());
  try {
    const config = {
      Authorization: `Bearer ${accessToken}`,
    };
    const res = await axiosInStanceJWT.put(
      `${apiUrl}/post/updatePost`,
      updatePost,
      {
        headers: config,
        ACCESS_PARAM: accessToken,
        REFRESH_PARAM: refreshToken,
      }
    );
    if (!res.data.message) {
      dispatch(updatePostSuccess());
      notify("Post Updated", "info");
    } else {
      dispatch(updatePostFailed());
      notify(res.data.message, "error");
    }
  } catch (error) {
    console.log(error);
    dispatch(updatePostFailed());
  }
};
export const deletePost = async (
  accessToken,
  refreshToken,
  postId,
  dispatch
) => {
  dispatch(deletePostStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };
    const res = await axiosInStanceJWT.delete(
      `${apiUrl}/post/delete/${postId}`,
      { headers:config, ACCESS_PARAM: accessToken, REFRESH_PARAM: refreshToken }
    );
    if (!res.data.message) {
      dispatch(deletePostSuccess());
      notify("Post Deleted", "info");
    } else {
      dispatch(deletePostFailed());
      notify(res.data.message, "error");
    }
  } catch (error) {
    console.log(error);
    dispatch(deletePostFailed());
  }
};
export const likePost = async (accessToken, refreshToken, postId, dispatch) => {
  dispatch(likePostStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };
    const res = await axiosInStanceJWT.post(
      `${apiUrl}/post/like/${postId}`,
      {},
      { headers:config, ACCESS_PARAM: accessToken, REFRESH_PARAM: refreshToken }
    );
    if (!res.data.message) {
      dispatch(likePostSuccess());
    } else {
      dispatch(likePostFailed());
      notify(res.data.message, "error");
    }
  } catch (error) {
    dispatch(likePostFailed());
  }
};
export const getAllPost = async (accessToken, refreshToken, dispatch) => {
  dispatch(getPostStart());
  try {
    const config = {
      Authorization: `Bearer ${accessToken}`,
    };
    const paging = {
      page: 0,
      pageSize: 5,
    };
    const res = await axiosInStanceJWT.post(`${apiUrl}/post/all`, paging, {
      headers: config,
      ACCESS_PARAM: accessToken,
      REFRESH_PARAM: refreshToken,
    });
    if (!res.data.message) {
      dispatch(getPostSuccess(res.data));
    } else {
      dispatch(getPostFailed());
    }
  } catch (error) {
    console.log(error);
    dispatch(getPostFailed());
  }
};
export const getPostByProfile = async (accessToken,refreshToken, profileId, dispatch) => {
  dispatch(getPostByProfileStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };
    const paging = {
      page: 0,
      pageSize: 5,
    };
    const res = await axios.post(
      `${api.post}/getPost/${profileId}`,
      paging,
      {
        headers: config,
        ACCESS_PARAM: accessToken,
        REFRESH_PARAM: refreshToken,
      }
    );
    if (!res.data.message) {
      dispatch(getPostByProfileSuccess(res.data));
    } else {
      dispatch(getPostByProfileFailed());
    }
  } catch (error) {
    dispatch(getPostByProfileFailed());
  }
};

export const uploadImages = async (
  accessToken,
  refreshToken,
  uploadImages,
  dispatch
) => {
  dispatch(uploadImagePostStart());
  try {
    const config = {
      "content-type": "multipart/form-data;",
      Authorization: `Bearer ${accessToken}`,
    };
    let formData = new FormData();
    uploadImages.forEach((file) => {
      formData.append("files", file.files);
    });
    const res = await axiosInStanceJWT.post(
      `${apiUrl}/image/post/upload`,
      formData,
      {
        headers: config,
        ACCESS_PARAM: accessToken,
        REFRESH_PARAM: refreshToken,
      }
    );
    if (res.data.message) {
      notify(res.data.message, "error");
    } else {
      dispatch(uploadImagePostSuccess(res.data.results));
    }
  } catch (error) {
    console.log(error);
    dispatch(uploadImagePostFailed());
  }
};

// #region Friend API
export const getAllFriendRequests = async (
  accessToken,
  refreshToken,
  dispatch
) => {
  dispatch(getFriendRequestStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };
    const paging = {
      page: 0,
      pageSize: 5,
    };
    const res = await axiosInStanceJWT.post(
      `${api.friend}/request/all`,
      paging,
      { headers:config, ACCESS_PARAM: accessToken, REFRESH_PARAM: refreshToken }
    );
    if (!res.data.message) {
      dispatch(getFriendRequestSuccess(res.data.results));
    } else {
      dispatch(getFriendRequestFailed());
    }
  } catch (error) {
    console.log(error);
    dispatch(getFriendRequestFailed());
  }
};
export const getAllFriends = async (accessToken, refreshToken,profileId, dispatch) => {
  dispatch(getAllFriendStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };
    const paging = {
      page: 0,
      pageSize: 5,
    };
    const res = await axiosInStanceJWT.post(`${api.friend}/all/${profileId}`, paging, {
      headers:config,
      ACCESS_PARAM: accessToken,
      REFRESH_PARAM: refreshToken,
    });
    if (!res.data.message) {
      dispatch(getAllFriendSuccess(res.data.results));
    } else {
      dispatch(getAllFriendFailed());
    }
  } catch (error) {
    console.log(error);
    dispatch(getAllFriendFailed());
  }
};
export const getAllFriendsForMainUser = async (accessToken,refreshToken, profileId, dispatch) => {
  dispatch(getAllFriendForMainUserStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };
    const paging = {
      page: 0,
      pageSize: 5,
    };
    const res = await axiosInStanceJWT.post(`${api.friend}/all/${profileId}`, paging, {
      headers:config,
      ACCESS_PARAM: accessToken,
      REFRESH_PARAM: refreshToken,
    });
    if (!res.data.message) {
      dispatch(getAllFriendForMainUserSuccess(res.data.results));
    } else {
      dispatch(getAllFriendForMainUserFailed());
    }
  } catch (error) {
    dispatch(getAllFriendForMainUserFailed());
  }
};
export const getMutualFriends = async (accessToken, refreshToken, id, dispatch) => {
  dispatch(getMutualFriendStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };

    const res = await axiosInStanceJWT.post(
      `${api.friend}/getMutualFriend/${id}`,
      {},
      { headers:config, ACCESS_PARAM: accessToken, REFRESH_PARAM: refreshToken }
    );
    if (!res.data.message) {
      dispatch(getMutualFriendSuccess(res.data.results));
    } else {
      dispatch(getMutualFriendFailed());
    }
  } catch (error) {
    console.log(error);
    dispatch(getMutualFriendFailed());
  }
};
export const addFriend = async (accessToken, refreshToken, id, dispatch) => {
  dispatch(addFriendStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };

    const res = await axiosInStanceJWT.post(
      `${api.friend}/sendFriendRequest/${id}`,
      {},
      { headers:config, ACCESS_PARAM: accessToken, REFRESH_PARAM: refreshToken }
    );
    if (!res.data.message) {
      dispatch(addFriendSuccess(res.data.results));
    } else {
      dispatch(addFriendFailed());
    }
  } catch (error) {
    console.log(error);
    dispatch(addFriendFailed());
  }
};
export const acceptFriendRequest = async (
  accessToken,
  refreshToken,
  id,
  dispatch
) => {
  dispatch(acceptFriendRequestStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };

    const res = await axiosInStanceJWT.post(
      `${api.friend}/acceptFriendRequest/${id}`,
      {},
      { headers:config, ACCESS_PARAM: accessToken, REFRESH_PARAM: refreshToken }
    );
    if (!res.data.message) {
      dispatch(acceptFriendRequestSuccess(res.data.results));
    } else {
      dispatch(acceptFriendRequestFailed());
    }
  } catch (error) {
    console.log(error);
    dispatch(acceptFriendRequestFailed());
  }
};
export const denyFriendRequest = async (
  accessToken,
  refreshToken,
  id,
  dispatch
) => {
  dispatch(denyFriendRequestStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };

    const res = await axiosInStanceJWT.post(
      `${api.friend}/denyFriendRequest/${id}`,
      {},
      { headers:config, ACCESS_PARAM: accessToken, REFRESH_PARAM: refreshToken }
    );
    if (!res.data.message) {
      dispatch(denyFriendRequestSuccess(res.data.results));
    } else {
      dispatch(denyFriendRequestFailed());
    }
  } catch (error) {
    console.log(error);
    dispatch(denyFriendRequestFailed());
  }
};
export const isFriend = async (accessToken, refreshToken, id, dispatch) => {
  dispatch(acceptFriendRequestStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };

    const res = await axiosInStanceJWT.post(
      `${api.friend}/isFriend/${id}`,
      {},
      { headers:config, ACCESS_PARAM: accessToken, REFRESH_PARAM: refreshToken }
    );
    if (!res.data.message) {
      dispatch(acceptFriendRequestSuccess(res.data.results));
    } else {
      dispatch(acceptFriendRequestFailed());
    }
  } catch (error) {
    console.log(error);
    dispatch(acceptFriendRequestFailed());
  }
};
// #endregion

export const getProfile = async (accessToken, refreshToken, id, dispatch) => {
  dispatch(getProfileDetailStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };
    const res = await axiosInStanceJWT.get(
      `${api.profile}/getProfileDetailById/${id}`,
      { headers:config, ACCESS_PARAM: accessToken, REFRESH_PARAM: refreshToken }
    );
    if (res.data.message) {
      notify(res.data.message, "error");
    } else {
      dispatch(getProfileDetailSuccess(res.data.results));
    }
  } catch (error) {
    console.log(error);
    dispatch(getProfileDetailFailed());
  }
};
export const getFriendSuggestion = async (
  accessToken,
  refreshToken,
  dispatch
) => {
  dispatch(getFriendSuggestionStart());
  try {
    const config = {
        Authorization: `Bearer ${accessToken}`,
    };
    const paging = {
      page: 0,
      pageSize: 5,
    };
    const res = await axiosInStanceJWT.post(
      `${api.profile}/friendSuggestion`,
      paging,
      { headers:config, ACCESS_PARAM: accessToken, REFRESH_PARAM: refreshToken }
    );
    if (!res.data.message) {
      dispatch(getFriendSuggestionSuccess(res.data.results));
    } else {
      dispatch(getFriendSuggestionFailed());
    }
  } catch (error) {
    console.log(error);
    dispatch(getFriendSuggestionFailed());
  }
};
