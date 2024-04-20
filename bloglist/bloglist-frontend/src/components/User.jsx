import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";
import { useMatch } from "react-router-dom";
import { useUserValue } from "../UserContext";

const User = () => {
  const loggedUser = useUserValue();
  const match = useMatch("/users/:id");
  const result = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    retry: 1,
  });
  if (result.isLoading) {
    return <div>Loading user data..</div>;
  }
  const users = result.data;
  const user = match
    ? users.find((user) => user.id === String(match.params.id))
    : null;

  if (!loggedUser) {
    return "";
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      {user.blogs.map((blog) => (
        <li key={blog.id}>{blog.title}</li>
      ))}
    </div>
  );
};

export default User;
