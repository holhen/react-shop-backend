import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Product } from "./models/product";

const client = new DynamoDBClient({
  region: "eu-north-1",
});

const getProducts = new ScanCommand({
  TableName: "products",
});

const getStocks = new ScanCommand({
  TableName: "stocks",
});

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  any
> = async () => {
  let response = await client.send(getProducts);
  const products = response.Items;

  response = await client.send(getStocks);
  const stocks = response.Items;

  const joined = products.map((product) => {
    const stock = stocks.find((stock) => stock.product_id.S === product.id.S);

    return {
      id: product.id.S,
      description: product.description.S,
      title: product.title.S,
      price: product.price.N,
      count: stock.count.N,
    };
  });
  return formatJSONResponse(joined);
};
