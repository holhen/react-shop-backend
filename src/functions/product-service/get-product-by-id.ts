import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { products } from "./__mocks__/products";

export const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event
) => {
  const product = products.find(
    (product) => product.id === event.pathParameters.productId
  );
  return formatJSONResponse(product);
};
