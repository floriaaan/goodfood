import {BlobServiceClient, BlockBlobUploadHeaders, ContainerClient} from "@azure/storage-blob";
import { AbortController } from "@azure/abort-controller";
import { File } from "node:buffer";
import * as console from "console";
import * as fs from "fs";


const containerName = 'image';
const {
    AZURE_STORAGE_SAS_TOKEN: sasToken,
    AZURE_STORAGE_RESOURCE_NAME: storageAccountName
} = process.env;

const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`;
console.log(uploadUrl);

// get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
const blobService = new BlobServiceClient(uploadUrl);

// get Container - full public read access
const containerClient: ContainerClient =
  blobService.getContainerClient(containerName);

export const uploadFileToBlob = async (file: File | null): Promise<string | null> => {
    if (!file) return null;

    // upload file
    return (await createBlobInContainer(file))._response.request.url;
};

const createBlobInContainer = async (file: File) => {
    // create blobClient for container
    const blobClient = containerClient.getBlockBlobClient(file.name);
    console.log(containerClient.getBlobBatchClient())
    // set mimetype as determined from browser with file upload control
    const options = {
        blobHTTPHeaders: { blobContentType: file.type },
        AbortSignal: AbortController.timeout(30 * 60 * 1000)
    };

    const buffer = file.arrayBuffer as unknown as ArrayBuffer;
    // upload file
    return await blobClient.uploadData(buffer)
};