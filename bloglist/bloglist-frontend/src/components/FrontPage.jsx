import { useRef } from "react";

import BlogForm from "./BlogForm";
import CreateForm from "./CreateForm";
import Togglable from "./Togglable";

import { useUserValue } from "../UserContext";

const FrontPage = () => {
  const blogFormStyle = {
    paddingBottom: "15px",
  };
  const createFormRef = useRef();
  const user = useUserValue();

  if (!user) {
    return "";
  }

  return (
    <>
      <div>
        <div style={blogFormStyle}>
          <BlogForm />
        </div>
        <Togglable buttonLabel="Create blog" ref={createFormRef}>
          <CreateForm
            toggleVisibility={() => createFormRef.current.toggleVisibility()}
          />
        </Togglable>
      </div>
    </>
  );
};

export default FrontPage;
