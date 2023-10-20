import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../libs/api-gateway";
import { Product } from "./models/product";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";

const client = new DynamoDBClient({
  region: "eu-north-1",
});

const docClient = DynamoDBDocumentClient.from(client);

const putProductCommand = (product: Product) =>
  new PutCommand({
    TableName: "products",
    Item: {
      id: product.id,
      description: product.description,
      title: product.title,
      price: product.price,
    },
  });

const putStocksCommand = (product: Product) =>
  new PutCommand({
    TableName: "stocks",
    Item: {
      product_id: product.id,
      count: product.count,
    },
  });

export const createProduct: ValidatedEventAPIGatewayProxyEvent = async (
  event
) => {
  const body = JSON.parse(event.body as string);
  const product: Product = {
    id: body.id ?? uuid(),
    description: body.description,
    title: body.title,
    price: body.price ?? 0,
    count: body.count ?? 0,
  };
  await docClient.send(putProductCommand(product));
  const putStocksResponse = await docClient.send(putStocksCommand(product));
  return formatJSONResponse(putStocksResponse);
};
