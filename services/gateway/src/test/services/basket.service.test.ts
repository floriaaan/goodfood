import { expect } from "chai";
import sinon from "sinon";
import * as basketService from "@gateway/services/basket.service"; // path to your service
import { basketServiceClient } from "@gateway/services/clients/basket.client";

describe("Basket Service", function () {
  afterEach(function () {
    sinon.restore();
  });

  it("getBasketByUser", async function () {
    const userId = "test-user-id";
    const expectedBasket = {}; // replace with expected basket object
    sinon.stub(basketServiceClient, "getBasket").yields(null, expectedBasket);

    const basket = await basketService.getBasketByUser(userId);

    expect(basket).to.equal(expectedBasket);
  });

  it("resetBasketByUser", async function () {
    const userId = "test-user-id";
    const expectedBasket = {}; // replace with expected basket object
    sinon.stub(basketServiceClient, "reset").yields(null, expectedBasket);

    const basket = await basketService.resetBasketByUser(userId);

    expect(basket).to.equal(expectedBasket);
  });
});
