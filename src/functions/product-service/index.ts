import { handlerPath } from "@libs/handler-resolver";

export const getProductsList = {
  handler: `${handlerPath(__dirname)}/get-products-list.getProductsList`,
  events: [
    {
      http: {
        method: "get",
        path: "products",
      },
    },
  ],
  url: {
    cors: true,
  },
};

export const getProductById = {
  handler: `${handlerPath(__dirname)}/get-product-by-id.getProductById`,
  events: [
    {
      http: {
        method: "get",
        path: "products/{productId}",
      },
    },
  ],
  url: {
    cors: true,
  },
};

export const createProduct = {
  handler: `${handlerPath(__dirname)}/create-product.createProduct`,
  events: [
    {
      http: {
        method: "post",
        path: "products",
      },
    },
  ],
  url: {
    cors: true,
  },
};
