import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "../../libs/api-gateway";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

const getProducts = new ScanCommand({
  TableName: "products",
});

const getStocks = new ScanCommand({
  TableName: "stocks",
});

export const getProductsList: ValidatedEventAPIGatewayProxyEvent = async () => {
  let response = await client.send(getProducts);
  const products = response.Items;

  response = await client.send(getStocks);
  const stocks = response.Items;

  const joined = products.map((product) => {
    const stock = stocks.find((stock) => stock.product_id.S === product.id.S);

    return {
      id: product.id.S,
      description: product.description?.S ?? "",
      title: product.title.S,
      price: product.price?.N ?? 0,
      count: stock?.count?.N ?? 0,
    };
  });
  return formatJSONResponse(joined);
};
