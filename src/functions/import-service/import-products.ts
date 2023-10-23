import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../libs/api-gateway";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: "eu-central-1",
});

export const importProducts: ValidatedEventAPIGatewayProxyEvent = async (
  event
) => {
  const command = new PutObjectCommand({
    Bucket: "product-store-csv",
    Key: `uploaded/${event.queryStringParameters.name}`,
  });

  const signedUrl = await getSignedUrl(client, command);
  return formatJSONResponse(signedUrl);
};
