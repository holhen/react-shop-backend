import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { formatJSONResponse } from "../../libs/api-gateway";
import { Product } from "./models/product";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const dynamoClient = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

const snsClient = new SNSClient({});

const TopicArn = "arn:aws:sns:eu-central-1:744566837372:createProductTopic";

const publishCommand = (product: Product) =>
  new PublishCommand({
    MessageAttributes: {
      id: {
        DataType: "String",
        StringValue: product.id,
      },
      description: {
        DataType: "String",
        StringValue: product.description,
      },
      title: {
        DataType: "String",
        StringValue: product.title,
      },
      price: {
        DataType: "Number",
        StringValue: product.price.toString(),
      },
      count: {
        DataType: "Number",
        StringValue: product.count.toString(),
      },
    },
    Message: `Successfully created product: ${JSON.stringify(product)}`,
    TopicArn,
  });

const batchWriteCommand = (productPutRequests, stocksPutRequests) =>
  new BatchWriteCommand({
    RequestItems: {
      products: productPutRequests,
      stocks: stocksPutRequests,
    },
  });

export const catalogBatchProcess = async (event) => {
  const productPutRequests = [];
  const stocksPutRequests = [];
  event.Records.forEach((record) => {
    const product: Product = JSON.parse(record.body);
    if (product.price) {
      product.price = +product.price;
    }
    if (product.count) {
      product.count = +product.count;
    }
    productPutRequests.push({
      PutRequest: {
        Item: {
          id: product.id,
          description: product.description,
          title: product.title,
          price: product.price,
        },
      },
    });
    stocksPutRequests.push({
      PutRequest: {
        Item: {
          product_id: product.id,
          count: product.count,
        },
      },
    });

    snsClient.send(publishCommand(product));
  });

  const batchWriteResponse = await docClient.send(
    batchWriteCommand(productPutRequests, stocksPutRequests)
  );

  return formatJSONResponse(batchWriteResponse);
};
