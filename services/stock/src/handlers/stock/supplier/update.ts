import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import { UpdateSupplierRequest, Supplier } from "@stock/types/stock";
import { Data } from "@stock/types";

export const UpdateSupplier = async (
  { request }: Data<UpdateSupplierRequest>,
  callback: (err: any, response: Supplier | null) => void
) => {
  try {
    const { name, id, contact } = request;
    const supplier = await prisma.supplier.update({
      where: { id },
      data: { name, contact },
    });

    callback(null, supplier);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
