import { useNotificationValue } from "../NotificationContext";
import { Alert } from "@mui/material";

const Notification = () => {
  const notification = useNotificationValue();

  if (notification.content === "") {
    return null;
  }

  const style = {
    color: notification.type === "error" ? "red" : "green",
    background: "#f9f9f9",
    fontSize: 14,
    fontFamily: "courier",
    borderStyle: "inset",
    borderRadius: 3,
    width: "400px",
    textAlign: "center",
    padding: 10,
    marginBottom: 10,
  };

  return <Alert severity={notification.type}>{notification.content}</Alert>;
};

export default Notification;
