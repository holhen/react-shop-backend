import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "../../libs/api-gateway";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Product } from "./models/product";

const client = new DynamoDBClient({
  region: "eu-north-1",
});

const getProductCommand = (productId: string) =>
  new QueryCommand({
    TableName: "products",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": { S: productId },
    },
  });

const getStockCommand = (productId: string) =>
  new QueryCommand({
    TableName: "stocks",
    KeyConditionExpression: "product_id = :product_id",
    ExpressionAttributeValues: {
      ":product_id": { S: productId },
    },
  });

export const getProductById: ValidatedEventAPIGatewayProxyEvent = async (
  event
) => {
  const getProduct = getProductCommand(event.pathParameters.productId);
  let response = await client.send(getProduct);
  const productItem = response.Items[0];
  const getStock = getStockCommand(event.pathParameters.productId);
  response = await client.send(getStock);
  const stocks = response.Items;
  const stockItem = stocks.find(
    (stock) => stock.product_id.S === productItem.id.S
  );

  const product: Product = {
    id: productItem.id.S,
    title: productItem.title.S,
    description: productItem.description.S,
    price: parseInt(productItem.price.N),
    count: parseInt(stockItem.count.N),
  };

  return formatJSONResponse(product);
};
