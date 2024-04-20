import userService from "../services/users";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useUserValue } from "../UserContext";

const UserStats = () => {
  const user = useUserValue();
  const result = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    retry: 1,
  });
  if (result.isLoading) {
    return (
      <div>
        <h2>Users</h2>
        Loading data..
      </div>
    );
  }

  const users = result.data;
  if (!user) {
    return "";
  }

  return (
    <div>
      <h2>Users</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell key={user.name}>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell key={user.username}>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserStats;
