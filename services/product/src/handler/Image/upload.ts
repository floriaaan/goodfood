import { Allergen } from "@product/types/Allergen";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";

var waitCounter: 0,
// the timeout after all chunks are read until all data is uploaded
maxWait: 0,
// just to show in the front end about the current upload progress: 0-100 (%)
uploadProgress: 0,
// used to avoid multiple output of chunk upload errors
chunkUploadError: false,
// store the filesize globally for this component
fileSize: 0,
// define the chunk size
chunkSize : 262144
// an array of all junks, defined their upload status either as active (true), or done (false)
currentUploads: [];

export const CreateAllergen = async (
	data: Data<Allergen>,
	callback: (err: ServerErrorResponse | null, response: Allergen | null) => void
) => {
	log.debug("Request received at CreateAllergen handler\n", data.request);
	try {
		callback(null, null);
	} catch (error: ServerErrorResponse | any) {
		log.error(error);
		callback(error, null);
	}
};