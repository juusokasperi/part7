import blogService from "../services/blogs";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

const BlogForm = () => {
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: 1,
  });
  if (result.isLoading) {
    return (
      <div>
        <h2>blogs</h2>
        Loading data..
      </div>
    );
  }

  const blogs = result.data;

  return (
    <div>
      <h2>Blogs</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link key={blog.id} to={`/blogs/${blog.id}`}>
                    {blog.title}
                  </Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BlogForm;
