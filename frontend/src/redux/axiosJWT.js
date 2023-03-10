import jwt_decode from "jwt-decode";
import axios from "axios";
import { store } from "../redux/store";
import { takeRefreshToken } from "./apiRequest";
import { refreshTokenSuccess, userDataAssign } from "./auth/authSlice";
import { useNavigate } from "react-router-dom";
import { revertAll } from "./resetStore";
import socket from "../socket/socket";
import { SOCKET_EVENT } from "../socket/socket.constant";

export let axiosInStanceJWT = axios.create();
axiosInStanceJWT.interceptors.request.use(
  async (config) => {
    if (jwt_decode(config.ACCESS_PARAM).exp < Date.now() / 1000) {
      const data = await takeRefreshToken(config.REFRESH_PARAM);
      if (data) {     
        var decoded = jwt_decode(data.access);
        store.dispatch(refreshTokenSuccess(data));
        store.dispatch(userDataAssign(decoded));
        config.headers["Authorization"] = `Bearer ${data.access}`;
      } else {
        debugger
        socket.off(SOCKET_EVENT.JOIN_ROOM);
        socket.off(SOCKET_EVENT.RERENDER_NOTIFICATION);
        socket.off(SOCKET_EVENT.RECEIVE_NOTIFICATION);
        store.dispatch(revertAll());
        window.location.replace("/login");
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
