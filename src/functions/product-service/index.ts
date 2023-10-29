export const getProductsList = {
  handler: "./get-products-list.getProductsList",
  events: [
    {
      http: {
        method: "get",
        path: "products",
        cors: true,
      },
    },
  ],
};

export const getProductById = {
  handler: "./get-product-by-id.getProductById",
  events: [
    {
      http: {
        method: "get",
        path: "products/{productId}",
        cors: true,
      },
    },
  ],
};

export const createProduct = {
  handler: "./create-product.createProduct",
  events: [
    {
      http: {
        method: "post",
        path: "products",
        cors: true,
      },
    },
  ],
};

export const catalogBatchProcess = {
  handler: "./catalog-batch-process.catalogBatchProcess",
  events: [
    {
      sqs: {
        arn: {
          "Fn::GetAtt": ["catalogItemsQueue", "Arn"],
        },
        batchSize: 5,
        maximumBatchingWindow: 10,
      },
    },
  ],
};
