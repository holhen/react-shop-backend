import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../libs/api-gateway";
import { Product } from "./models/product";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import schema from "./schema";

const client = new DynamoDBClient({
  region: "eu-north-1",
});

const docClient = DynamoDBDocumentClient.from(client);

const putProductCommand = (product: Product) =>
  new PutCommand({
    TableName: "products",
    Item: product,
  });

const putStocksCommand = (productId: string) =>
  new PutCommand({
    TableName: "stocks",
    Item: {
      product_id: productId,
      count: 1,
    },
  });

export const createProduct: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const product: Product = event.body.product as Product;
  console.log(product);
  await docClient.send(putProductCommand(product));
  const putStocksResponse = docClient.send(putStocksCommand(product.id));
  return formatJSONResponse(putStocksResponse);
};
