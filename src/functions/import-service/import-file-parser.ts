import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import csvParser from "csv-parser";

const s3Client = new S3Client({
  region: "eu-central-1",
});

const sqsClient = new SQSClient({});
const sqsURL =
  "https://sqs.eu-central-1.amazonaws.com/744566837372/catalogItemsQueue";

export const importFileParser = async (event) => {
  const bucket = "product-store-csv";
  for (let record of event.Records) {
    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: record.s3.object.key,
    });

    const sendMessageCommand = (message: string) =>
      new SendMessageCommand({
        QueueUrl: sqsURL,
        MessageBody: message,
      });

    const response = await s3Client.send(getCommand);
    const body = response.Body;
    body.pipe(csvParser()).on("data", (data) => {
      sqsClient.send(sendMessageCommand(JSON.stringify(data)));
    });

    const copyCommand = new CopyObjectCommand({
      Bucket: bucket,
      Key: record.s3.object.key.replace("uploaded", "parsed"),
      CopySource: `${bucket}/${record.s3.object.key}`,
    });

    await s3Client.send(copyCommand);

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: record.s3.object.key,
    });

    await s3Client.send(deleteCommand);
  }
};
