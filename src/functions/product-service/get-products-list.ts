import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { products } from "./__mocks__/products";

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  any
> = async () => {
  return formatJSONResponse(products);
};
