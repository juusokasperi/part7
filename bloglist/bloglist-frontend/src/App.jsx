import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, AppBar, Toolbar, Button } from "@mui/material";
import UserContext from "./UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import FrontPage from "./components/FrontPage";
import UserStats from "./components/UserStats";
import User from "./components/User";
import Blog from "./components/Blog";

const App = () => {
  const [user, userDispatch] = useContext(UserContext);

  const appStyle = {
    fontFamily: "Arial",
    fontSize: "14px",
  };

  const LoginInfo = () => {
    const navigate = useNavigate();

    const logOutButton = () => {
      userDispatch({ type: "LOGOUT" });
      console.log("logged out");
      navigate("/");
    };

    return (
      <>
        {user.name} logged in{" "}
        <Button color="inherit" onClick={logOutButton}>
          Log out
        </Button>
      </>
    );
  };

  return (
    <Container>
      <div style={appStyle}>
        <Router>
          {user && (
            <AppBar position="static" sx={{ marginBottom: "15px" }}>
              <Toolbar>
                <Button color="inherit" component={Link} to="/">
                  blogs
                </Button>
                <Button color="inherit" component={Link} to="/users">
                  users
                </Button>
                <em>
                  <LoginInfo />
                </em>
              </Toolbar>
            </AppBar>
          )}
          <Notification />
          <h1>App</h1>
          <LoginForm />
          <Routes>
            <Route path="/blogs/:id" element={<Blog />} />
            <Route path="/" element={<FrontPage />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/users" element={<UserStats />} />
          </Routes>
        </Router>
      </div>
    </Container>
  );
};

export default App;
