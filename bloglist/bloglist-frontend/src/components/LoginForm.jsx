import UserContext from "../UserContext";
import { useContext, useEffect } from "react";
import { useNotificationDispatch } from "../NotificationContext";
import loginService from "../services/login";
import { TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const LoginForm = () => {
  const [user, userDispatch] = useContext(UserContext);
  const notificationDispatch = useNotificationDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const loggedInUser = JSON.parse(loggedUserJSON);
      userDispatch({ type: "LOGIN", payload: loggedInUser });
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    event.target.username.value = "";
    event.target.password.value = "";
    console.log("logging in with", username, password);

    try {
      const loggedUser = await loginService.login({ username, password });
      userDispatch({ type: "LOGIN", payload: loggedUser });
      notificationDispatch({
        type: "NOTIFY",
        payload: `Logged in as ${loggedUser.name}`,
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 3000);
    } catch (exception) {
      notificationDispatch({
        type: "ERROR",
        payload: `Invalid username or password.`,
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 3000);
    }
  };
  if (!user) {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <TextField
              label="Username"
              size="small"
              data-testid="username"
              type="text"
              name="username"
              autoComplete="username"
            />
          </div>
          <div>
            <TextField
              label="Password"
              size="small"
              sx={{
                marginTop: "10px",
                marginBottom: "10px",
              }}
              data-testid="password"
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </div>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            endIcon={<SendIcon />}
            type="submit"
          >
            Log in
          </Button>
        </form>
      </div>
    );
  }

  if (user) {
    return "";
  }
};

export default LoginForm;
