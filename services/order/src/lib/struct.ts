import { Prisma } from "@prisma/client";

export type Struct = {
  fields: {
    [key: string]: {
      kind: string;
      [key: string]: any;
    };
  };
};

export const parseStruct = (struct: Struct) => {
  if (!struct) return null;
  const fields = struct.fields;

  if (!fields || Object.keys(fields).length === 0) return null;

  const parsed = Object.entries(fields).reduce((acc: any, [key, value]) => {
    return {
      ...acc,
      [key]: value[value.kind],
    };
  }, {});

  return parsed;
};

export const toStruct = (
  obj: { [key: string]: any } | Prisma.JsonValue | null
): Struct => {
  if (!obj) return { fields: {} };
  const fields = Object.entries(obj).reduce((acc: any, [key, value]) => {
    return {
      ...acc,
      [key]: {
        kind: `${typeof value}Value`,
        [`${typeof value}Value`]: value,
      },
    };
  }, {});

  return { fields };
};
