const request = require("supertest");
const app = require("./app.mock");

describe("GET / URL not found", () => {
  it("should respond with a 200 status code", async () => {
    const response = await request(app).get("/");
    expect(response.header["content-type"]).toEqual("text/html; charset=utf-8");
    expect(response.statusCode).toEqual(200);
  });
});

describe("GET / URL not found", () => {
  it("should respond with a 404 status code", async () => {
    //random string to create invalid request
    const randomString = String(Math.random().toString().substring(2, 6));
    const response = await request(app).get(`/${randomString}`);
    expect(response.statusCode).toEqual(404);
  });
});
