import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import csvParser from "csv-parser";

const client = new S3Client({
  region: "eu-central-1",
});

export const importFileParser = async (event) => {
  const bucket = "product-store-csv";
  for (let record of event.Records) {
    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: record.s3.object.key,
    });

    const response = await client.send(getCommand);
    const body = response.Body;
    body.pipe(csvParser()).on("data", (data) => {
      console.log(data);
    });

    const copyCommand = new CopyObjectCommand({
      Bucket: bucket,
      Key: record.s3.object.key.replace("uploaded", "parsed"),
      CopySource: `${bucket}/${record.s3.object.key}`,
    });

    await client.send(copyCommand);

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: record.s3.object.key,
    });

    await client.send(deleteCommand);
  }
};
