import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import { CreateSupplierRequest, Supplier } from "@stock/types/stock";
import { Data } from "@stock/types";

export const CreateSupplier = async (
  { request }: Data<CreateSupplierRequest>,
  callback: (err: any, response: Supplier | null) => void
) => {
  try {
    const { name, contact } = request;

    const supplier = await prisma.supplier.create({
      data: { name, contact },
    });

    callback(null, supplier);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
