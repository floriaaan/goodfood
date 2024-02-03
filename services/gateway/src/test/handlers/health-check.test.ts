import { app } from "@gateway/server";
import request from "supertest";
import { expect } from "chai";

describe("GET /health-check", function () {
  it("responds with json", function (done) {
    request(app)
      .get("/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an("object");
        done();
      });
  });
});
