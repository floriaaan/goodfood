import { Struct, parseStruct, toStruct } from "@stock/lib/struct";
import { assert, describe, it } from "vitest";

describe("tests@goodfood/stock.struct.parseStruct", function () {
  it("tests @goodfood/stock.struct.parseStruct in expected situation", () => {
    const _struct = {
      fields: {
        id: {
          kind: "stringValue",
          stringValue: "1",
        },
        name: {
          kind: "numberValue",
          numberValue: "2",
        },
      },
    };
    const parsed = parseStruct(_struct);
    assert.equal(parsed.id, "1");
    assert.equal(parsed.name, "2");
  });

  it("tests @goodfood/stock.struct.parseStruct with empty struct", () => {
    const _struct = {
      fields: {},
    };
    const parsed = parseStruct(_struct);
    assert.equal(parsed, null);
  });

  it("tests @goodfood/stock.struct.parseStruct with null struct", () => {
    const _struct = null;
    const parsed = parseStruct(_struct as unknown as Struct);
    assert.equal(parsed, null);
  });
});

describe("tests@goodfood/stock.struct.toStruct", function () {
  it("tests @goodfood/stock.struct.toStruct in expected situation", () => {
    const _struct = {
      id: 1,
      name: "2",
    };
    const parsed = toStruct(_struct);
    assert.equal(parsed.fields.id.kind, "numberValue");
    assert.equal(parsed.fields.id.numberValue, 1);
    assert.equal(parsed.fields.name.kind, "stringValue");
    assert.equal(parsed.fields.name.stringValue, "2");

    assert.equal(Object.keys(parsed.fields).length, 2);
  });

  it("tests @goodfood/stock.struct.toStruct with empty struct", () => {
    const _struct = {};
    const parsed = toStruct(_struct);
    assert.equal(Object.keys(parsed.fields).length, 0);
  });

  it("tests @goodfood/stock.struct.toStruct with null struct", () => {
    const _struct = null;
    const parsed = toStruct(_struct as unknown as Struct);
    assert.equal(Object.keys(parsed.fields).length, 0);
  })
});
