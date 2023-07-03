import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { File } from "node:buffer";


const containerName = 'uploaded';
const sasToken = process.env.REACT_APP_AZURE_STORAGE_SAS_TOKEN;
const storageAccountName = process.env.REACT_APP_AZURE_STORAGE_RESOURCE_NAME;

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

    // set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: file.type } };

    // upload file
    return await blobClient.uploadData(((file.arrayBuffer) as unknown as Buffer), options);
};