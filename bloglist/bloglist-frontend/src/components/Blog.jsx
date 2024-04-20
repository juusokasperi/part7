import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useMatch, useNavigate } from "react-router-dom";
import { useUserValue } from "../UserContext";
import { useNotificationDispatch } from "../NotificationContext";
import { TextField, Button } from "@mui/material";

const Blog = () => {
  const navigate = useNavigate();
  const user = useUserValue();
  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const blogLikeMutation = useMutation({
    mutationFn: blogService.like,
    onSuccess: (likedBlog) => {
      const blogs = queryClient
        .getQueryData(["blogs"])
        .map((b) =>
          b.id !== likedBlog.id ? b : { ...b, likes: likedBlog.likes },
        );
      const sortedBlogs = blogs.sort(
        (blog1, blog2) => blog2.likes - blog1.likes,
      );
      queryClient.setQueryData(["blogs"], sortedBlogs);
    },
  });

  const newCommentMutation = useMutation({
    mutationFn: blogService.comment,
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      notificationDispatch({
        type: "NOTIFY",
        payload: `Comment added succesfully!`,
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 3000);
    },
    onError: (error) => {
      notificationDispatch({ type: "ERROR", payload: "Blog creation failed!" });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 3000);
    },
  });

  const handleLike = async (blog) => {
    blogLikeMutation.mutate(blog);
    notificationDispatch({
      type: "NOTIFY",
      payload: `Blog '${blog.title}' liked!`,
    });
    setTimeout(() => {
      notificationDispatch({ type: "CLEAR" });
    }, 3000);
  };

  const blogRemoveMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (removedBlogId) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((b) => b.id !== removedBlogId),
      );
    },
  });

  const handleDelete = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`);
    if (ok) {
      blogRemoveMutation.mutate(blog.id);
      notificationDispatch({
        type: "NOTIFY",
        payload: `New blog ${blog.title} by ${blog.author} removed succesfully!`,
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 3000);
      navigate("/");
    }
  };

  const match = useMatch("/blogs/:id");
  const blogsResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: 1,
  });
  const commentsResult = useQuery({
    queryKey: ["comments"],
    queryFn: () => blogService.getComments(String(match.params.id)),
    retry: 1,
  });
  if (blogsResult.isLoading || commentsResult.isLoading) {
    return <div>Loading blog data..</div>;
  }
  const blogs = blogsResult.data;
  const comments = commentsResult.data;

  const blog = match
    ? blogs.find((blog) => blog.id === String(match.params.id))
    : null;

  const Comments = () => {
    if (comments.length === 0) {
      return <p>No comments yet.</p>;
    }
    return (
      <p>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </p>
    );
  };

  const DeleteButton = () => {
    if (blog.user.username === user.username) {
      return (
        <>
          <Button
            size="small"
            variant="outlined"
            sx={{ marginTop: "5px", marginBottom: "5px" }}
            color="primary"
            onClick={() => handleDelete(blog)}
          >
            delete
          </Button>
          <br />
        </>
      );
    } else {
      return null;
    }
  };

  const addComment = (event) => {
    event.preventDefault();
    const newObject = { content: event.target.comment.value, id: blog.id };
    event.target.comment.value = "";
    newCommentMutation.mutate(newObject);
  };

  if (!user) {
    return "";
  }

  if (blog.url.includes("://")) {
    return (
      <div>
        <h2>{blog.name}</h2>
        <a href={`${blog.url}`}>{blog.url}</a>
        <br />
        {blog.likes} likes{" "}
        <Button
          size="small"
          variant="outlined"
          sx={{ marginTop: "5px", marginBottom: "5px" }}
          color="primary"
          onClick={() => handleLike(blog)}
        >
          like
        </Button>{" "}
        <br />
        added by {blog.user.name} <br />
        <DeleteButton />
        <h3>Comments</h3>
        <form onSubmit={addComment}>
          <TextField label="Comment" type="text" name="comment" />
          &nbsp;
          <Button
            size="small"
            variant="outlined"
            sx={{ marginTop: "5px", marginBottom: "5px" }}
            color="primary"
            type="submit"
          >
            Add comment
          </Button>
        </form>
        <Comments />
      </div>
    );
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={`//${blog.url}`}>{blog.url}</a>
      <br />
      {blog.likes} likes{" "}
      <Button
        size="small"
        variant="outlined"
        sx={{ marginTop: "5px", marginBottom: "5px" }}
        color="primary"
        onClick={() => handleLike(blog)}
      >
        like
      </Button>{" "}
      <br />
      added by {blog.user.name} <br />
      <DeleteButton />
      <h3>Comments</h3>
      <form onSubmit={addComment}>
        <TextField size="small" type="text" name="comment" />
        &nbsp;
        <Button
          size="small"
          variant="outlined"
          sx={{ marginTop: "5px", marginBottom: "5px" }}
          color="primary"
          type="submit"
        >
          Add comment
        </Button>
      </form>
      <Comments />
    </div>
  );
};

export default Blog;
