import type { AWS } from "@serverless/typescript";

import {
  getProductsList,
  getProductById,
  createProduct,
  catalogBatchProcess,
} from "./index";

const serverlessConfiguration: AWS = {
  service: "products-service",
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
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "sns:Publish",
        Resource: "arn:aws:sns:eu-central-1:744566837372:createProductTopic",
      },
    ],
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductById,
    createProduct,
    catalogBatchProcess,
  },
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
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      expensiveProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "henrik_hollosi@epam.com",
          Protocol: "email",
          TopicArn: "arn:aws:sns:eu-central-1:744566837372:createProductTopic",
          FilterPolicy: {
            price: [
              {
                numeric: [">=", 100],
              },
            ],
          },
        },
      },
      cheapProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "holhen@gmail.com",
          Protocol: "email",
          TopicArn: "arn:aws:sns:eu-central-1:744566837372:createProductTopic",
          FilterPolicy: {
            price: [
              {
                numeric: ["<", 100],
              },
            ],
          },
        },
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
