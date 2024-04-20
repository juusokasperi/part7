const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment")
const middleware = require("../utils/middleware");

blogsRouter.get("/:id/comments", async (request, response) => {
  const comments = await Comment.find({ blog: request.params.id }).populate("blog", {
    id: 1,
    title: 1
  });
  response.json(comments);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const body = request.body;
  const comment = new Comment({
    content: body.content,
    blog: request.params.id
  })

  const savedComment = await comment.save();
  response.status(201).json(savedComment);
})


blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate("user", {
      username: 1,
      name: 1,
      id: 1,
    });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const body = request.body;
  if (!request.token || !user.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const blogUser = await User.findById(user.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: blogUser._id,
  });

  const savedBlog = await blog.save();
  blogUser.blogs = blogUser.blogs.concat(savedBlog._id);
  await blogUser.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const blogToDelete = await Blog.findById(request.params.id);

    if (user.id !== blogToDelete.user.toString()) {
      return response
        .status(401)
        .json({ error: "user not authorized to delete this blog" });
    }
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  },
);

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
