// eslint-disable-next-line no-unused-vars
const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const helper = require("./test_helper");

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  //Clear the blogs and users
  await Blog.deleteMany({});
  await User.deleteMany({});
  //Insert the blogs from helper to test databasess
  await Blog.insertMany(helper.initialBlogs);
});

test("correct amount of blogs is returned", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("the blogs are returned as JSON", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("the returned blogs have an id field", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body[0].id, helper.initialBlogs[0]._id);
});

test("adding blogs to the db works", async () => {
  //Create test user, login and fetch token
  const token = await helper.loginToken();

  //Run test with the token
  const newBlog = {
    title: "Jusseli",
    author: "Pullaheikki",
    url: "www.google.com",
    user: "65e9e9e3038102320abcb16e",
    likes: 13,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);

  const addedBlog = response.body.find((blog) => blog.title === newBlog.title);

  assert.strictEqual(addedBlog.title, newBlog.title);
  assert.strictEqual(addedBlog.author, newBlog.author);
  assert.strictEqual(addedBlog.url, newBlog.url);
  assert.strictEqual(addedBlog.likes, newBlog.likes);
  assert.strictEqual(!addedBlog.id, false);
});

test("if added blog has no likes field, it is set to 0", async () => {
  //Create test user, login and fetch token
  const token = await helper.loginToken();

  //Run test with the token
  const newBlog = {
    title: "Hienopa",
    author: "Puelihaelsu",
    url: "www.google.com",
  };
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  const addedBlog = response.body[response.body.length - 1];

  assert.strictEqual(addedBlog.likes, 0);
});

test("if added blog has no title or url, error 400 returned", async () => {
  //Create test user, login and fetch token
  const token = await helper.loginToken();

  //Run test with the token
  const newBlog = {
    title: "Terve",
    author: "Nettisivuilta",
    likes: 12,
  };
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);

  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("deleting a blog works and returns code 204", async () => {
  //Create test user, login and fetch token
  const token = await helper.loginToken();

  //First we create a blog with the created user
  const newBlog = {
    title: "Jusseli",
    author: "Pullaheikki",
    url: "www.google.com",
    user: "65e9e9e3038102320abcb16e",
    likes: 13,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  //Then the test
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[blogsAtStart.length - 1];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
});

test("modifying a single blog works", async () => {
  //Create test user, login and fetch token
  const token = await helper.loginToken();

  //First we create a blog with the created user
  const newBlog = {
    title: "Jusseli",
    author: "Pullaheikki",
    url: "www.google.com",
    user: "65e9e9e3038102320abcb16e",
    likes: 13,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // Then the test itself
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[blogsAtStart.length - 1];
  const updatedBlog = {
    title: "Heippaliini",
    likes: 48,
  };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(updatedBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(
    blogsAtEnd[blogsAtEnd.length - 1].title,
    updatedBlog.title,
  );
  assert.strictEqual(
    blogsAtEnd[blogsAtEnd.length - 1].likes,
    updatedBlog.likes,
  );
});

test("adding blogs without a token returns 401 Unauthorized", async () => {
  //Run test without a token
  const newBlog = {
    title: "Jusseli",
    author: "Pullaheikki",
    url: "www.google.com",
    user: "65e9e9e3038102320abcb16e",
    likes: 13,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
