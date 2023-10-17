import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Product } from "./models/product";
import schema from "./schema";

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

export const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const command = getProductCommand(event.pathParameters.productId);
  const response = await client.send(command);
  const productItem = response.Items[0];
  const product: Product = {
    id: productItem.id.S,
    title: productItem.title.S,
    description: productItem.description.S,
    price: parseInt(productItem.price.N),
  };

  return formatJSONResponse(product);
};
