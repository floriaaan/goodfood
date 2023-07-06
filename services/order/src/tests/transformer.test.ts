import { toStruct } from "@order/lib/struct";
import { toGrpc } from "@order/lib/transformer";
import { ExtendedOrder } from "@order/types/order";
import { Status } from "@prisma/client";
import { assert, describe, it } from "vitest";

describe("tests@goodfood/order.transformer.toGrpc", function () {
  it("tests @goodfood/order.transformer.toGrpc in expected situation", () => {
    const _order: ExtendedOrder = {
      id: "order_id:1",
      payment_id: "payment_id:1",
      delivery_id: "delivery_id:1",
      delivery_type: "DELIVERY",
      restaurant_id: "restaurant_id:1",
      user: {
        id: "user_id:1",
        first_name: "first_name",
        last_name: "last_name",
        email: "email",
        phone: "phone",
      },
      basket_snapshot: {
        string:
          '{"products":[{"id":"product_id:1","name":"product_name","price":1,"quantity":1}]}',
        json: {
          products: [
            { id: "product_id:1", name: "product_name", price: 1, quantity: 1 },
          ],
        },
      },
      status: Status.PENDING,
    };
    const parsed = toGrpc(_order);

    assert.equal(parsed?.id, "order_id:1");
    assert.equal(parsed?.payment_id, "payment_id:1");
    assert.equal(parsed?.delivery_id, "delivery_id:1");
    assert.equal(parsed?.delivery_type, "DELIVERY");
    assert.equal(parsed?.restaurant_id, "restaurant_id:1");
    assert.equal(parsed?.user.id, "user_id:1");
    assert.equal(parsed?.user.first_name, "first_name");
    assert.equal(parsed?.user.last_name, "last_name");
    assert.equal(parsed?.user.email, "email");
    assert.equal(parsed?.user.phone, "phone");
    assert.equal(
      parsed?.basket_snapshot.string,
      '{"products":[{"id":"product_id:1","name":"product_name","price":1,"quantity":1}]}'
    );
    assert.deepEqual(
      parsed?.basket_snapshot.json,
      toStruct(_order.basket_snapshot.json)
    );
    assert.equal(parsed?.status, Status.PENDING);
  });

  it("tests @goodfood/order.transformer.toGrpc with empty order", () => {
    const _order: ExtendedOrder = {
      id: "",
      payment_id: "",
      delivery_id: "",
      delivery_type: "DELIVERY",
      restaurant_id: "",
      user: {
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      },
      basket_snapshot: {
        string: "",
        json: {},
      },
      status: Status.PENDING,
    };
    const parsed = toGrpc(_order);

    assert.equal(parsed?.id, "");
    assert.equal(parsed?.payment_id, "");
    assert.equal(parsed?.delivery_id, "");
    assert.equal(parsed?.delivery_type, "DELIVERY");
    assert.equal(parsed?.restaurant_id, "");
    assert.equal(parsed?.user.id, "");
    assert.equal(parsed?.user.first_name, "");
    assert.equal(parsed?.user.last_name, "");
    assert.equal(parsed?.user.email, "");
    assert.equal(parsed?.user.phone, "");
    assert.equal(parsed?.basket_snapshot.string, "");
    assert.deepEqual(parsed?.basket_snapshot.json, toStruct({}));
    assert.equal(parsed?.status, Status.PENDING);
  });

  it("tests @goodfood/order.transformer.toGrpc with null order", () => {
    const _order: ExtendedOrder = null as any;
    const parsed = toGrpc(_order);
    assert.equal(parsed, null);
  });
});
