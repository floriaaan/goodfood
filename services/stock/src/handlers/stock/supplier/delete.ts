import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  DeleteSupplierRequest,
  DeleteSupplierResponse,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const DeleteSupplier = async (
  { request }: Data<DeleteSupplierRequest>,
  callback: (
    err: any,
    response: DeleteSupplierResponse | null
  ) => void
) => {
  try {
    const { id } = request;
    await prisma.supplier.delete({ where: { id } });
    callback(null, { success: true });
  } catch (error) {
    log.error(error);
    callback(error, { success: false });
  }
};
