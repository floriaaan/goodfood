import { Image, Url } from "@product/types/Product";
import { uploadFileToBlob } from "@product/lib/storage";
import { Data } from "@product/types";
import { log } from "@product/lib/log";
import { ServerErrorResponse } from "@grpc/grpc-js";
import { decode } from "base64-arraybuffer";
import { File } from "node:buffer";

export const UploadImage = async (
	{ request }:  Data<Image>,
	callback: (err: ServerErrorResponse | null, response: Url | null) => void
) => { 
	log.debug("Request received at UploadImage handler\n", request);
	try {
		const image = request.data as string;
		if (!image) 
			throw(Error("No image provided") as ServerErrorResponse);
		
		const contentType = image.match(/data:(.*);base64/)?.[1];
		const base64FileData = image.split("base64,")?.[1];

		if (!contentType || !base64FileData) 
			throw(Error("Image data not valid") as ServerErrorResponse);
		
		log.debug(contentType);

		// Resize image and compress
		const buffer = decode(base64FileData);
		const resizedBuffer = Buffer.from(buffer);

		// Upload image
		const fileName = request.name;
		const ext = contentType.split("/")[1];
		const path = `${fileName}.${ext}`;

		const file = {
			name: fileName,
			type: ext,
			arrayBuffer: resizedBuffer,
		} as unknown as File;
		log.debug(file);
		const url = { path : await uploadFileToBlob(file) } as Url;


		callback(null, url);
	} catch (error: ServerErrorResponse | any) {
		log.error(error);
		callback(error, null);
	}
};