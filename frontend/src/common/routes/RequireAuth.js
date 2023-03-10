import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { getRefreshToken } from "../../redux/apiRequest";
import { revertAll } from "../../redux/resetStore";
const RequireAuth = () => {
  const auth = useSelector((state) => state.auth.login);
  const dispatch = useDispatch();
  var refreshToken = auth.currentUser?.refresh ?? "";
  var reFreshIsExpired = false;
  if (refreshToken !== "" && jwt_decode(refreshToken).exp < Date.now() / 1000) {
    console.log("reFreshToken is expired");
    reFreshIsExpired = true;
    dispatch(revertAll())
  } 
  const location = useLocation();
  return auth?.currentUser && !reFreshIsExpired ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
