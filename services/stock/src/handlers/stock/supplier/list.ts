import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import { GetSuppliersResponse } from "@stock/types/stock";
import { Data } from "@stock/types";

export const GetSuppliers = async (
  {}: Data<null>,
  callback: (err: any, response: GetSuppliersResponse | null) => void
) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    callback(null, { suppliers });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
