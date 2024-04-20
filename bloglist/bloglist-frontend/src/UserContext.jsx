import { createContext, useReducer, useContext } from "react";
import blogService from "./services/blogs";

const userReducer = (state, action) => {
  switch (action.type) {
  case "LOGIN":
    window.localStorage.setItem(
      "loggedBlogappUser",
      JSON.stringify(action.payload),
    );
    blogService.setToken(action.payload.token);
    return action.payload;
  case "LOGOUT":
    window.localStorage.removeItem("loggedBlogappUser");
    return null;
  default:
    return state;
  }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUserValue = () => {
  const notificationAndDispatch = useContext(UserContext);
  return notificationAndDispatch[0];
};

export const useUserDispatch = () => {
  const notificationAndDispatch = useContext(UserContext);
  return notificationAndDispatch[1];
};

export default UserContext;
