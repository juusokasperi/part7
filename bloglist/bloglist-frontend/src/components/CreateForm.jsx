import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNotificationDispatch } from "../NotificationContext";
import blogService from "../services/blogs";
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const CreateForm = ({ toggleVisibility }) => {
  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (blogObject) => {
      queryClient.invalidateQueries([
        { queryKey: ["blogs"] },
        { queryKey: ["users"] },
      ]);
      notificationDispatch({
        type: "NOTIFY",
        payload: `New blog '${blogObject.title}' by ${blogObject.author} added succesfully!`,
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 3000);
      toggleVisibility();
    },
    onError: (error) => {
      notificationDispatch({ type: "ERROR", payload: "Blog creation failed!" });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 3000);
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    const blogObject = {
      title: event.target.blogTitle.value,
      author: event.target.blogAuthor.value,
      url: event.target.blogUrl.value,
    };
    event.target.blogTitle.value = "";
    event.target.blogAuthor.value = "";
    event.target.blogUrl.value = "";
    newBlogMutation.mutate(blogObject);
  };

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField
            label="Title"
            sx={{ margin: "2px" }}
            size="small"
            type="text"
            data-testid="blogTitle"
            name="blogTitle"
            placeholder="Write title here"
          />
          <TextField
            label="Author"
            sx={{ margin: "2px" }}
            size="small"
            type="text"
            data-testid="blogAuthor"
            name="blogAuthor"
            placeholder="Write author here"
          />
          <TextField
            label="URL"
            sx={{ margin: "2px" }}
            size="small"
            type="text"
            data-testid="blogUrl"
            name="blogUrl"
            placeholder="Write URL here"
          />
        </div>
        <Button
          size="small"
          variant="outlined"
          sx={{ marginTop: "5px", marginBottom: "5px" }}
          color="primary"
          endIcon={<SendIcon />}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CreateForm;
