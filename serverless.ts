import type { AWS } from "@serverless/typescript";

import {
  getProductsList,
  getProductById,
  createProduct,
} from "@functions/product-service";

const serverlessConfiguration: AWS = {
  service: "shop-backend",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    region: "eu-central-1",
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct },
  resources: {
    Resources: {
      productsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "products",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
            {
              AttributeName: "title",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
            {
              AttributeName: "title",
              KeyType: "RANGE",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      stocksTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "stocks",
          AttributeDefinitions: [
            {
              AttributeName: "product_id",
              AttributeType: "S",
            },
            {
              AttributeName: "count",
              AttributeType: "N",
            },
          ],
          KeySchema: [
            {
              AttributeName: "product_id",
              KeyType: "HASH",
            },
            {
              AttributeName: "count",
              KeyType: "RANGE",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
