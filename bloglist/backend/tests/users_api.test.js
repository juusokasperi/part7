const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");

const helper = require("./test_helper");

const User = require("../models/user");

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("user creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "juuso",
      name: "Juuso",
      password: "salasana",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creating new user fails with statuscode and msg if username is already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Kunnon meno",
      password: "salasana",
    };

    const result = await api
      .post("/api/users/")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creating a new user fails if missing password", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Pomo",
      username: "Kissa",
    };

    const result = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();

    assert(result.body.error.includes("password is missing"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creating a new user fails if missing username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Pissa",
      password: "salasana",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creating a new user fails if username is less than 3 characters long", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Pissa",
      username: "Pz",
      password: "salasana",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creating a new user fails if password is less than 3 characters long", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Pissa",
      username: "Pazu",
      password: "sa",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
