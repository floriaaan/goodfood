import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import { GetSupplierRequest, Supplier } from "@stock/types/stock";
import { Data } from "@stock/types";

export const GetSupplier = async (
  { request }: Data<GetSupplierRequest>,
  callback: (err: any, response: Supplier | null) => void
) => {
  try {
    const { id } = request;
    const supplier = await prisma.supplier.findUniqueOrThrow({
      where: { id },
    });
    callback(null, supplier);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
