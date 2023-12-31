import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "import-service",
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
        Action: "s3:ListBucket",
        Resource: "arn:aws:s3:::product-store-csv",
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: "arn:aws:s3:::product-store-csv/*",
      },
      {
        Effect: "Allow",
        Action: "sqs:SendMessage",
        Resource: "arn:aws:sqs:eu-central-1:744566837372:catalogItemsQueue",
      },
    ],
  },
  // import the function via paths
  functions: {
    importProducts: {
      handler: "./import-products.importProducts",
      events: [
        {
          http: {
            method: "get",
            path: "import",
            cors: true,
            authorizer: {
              arn: "arn:aws:lambda:eu-central-1:744566837372:function:authorization-service-dev-basicAuthorizer",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization",
              identityValidationExpression: ".*",
              managedExternally: false,
              type: "request",
            },
            request: {
              parameters: {
                querystrings: {
                  name: true,
                },
              },
            },
          },
        },
      ],
    },
    importFileParser: {
      handler: "./import-file-parser.importFileParser",
      events: [
        {
          s3: {
            bucket: "product-store-csv",
            event: "s3:ObjectCreated:*",
            rules: [
              {
                prefix: "uploaded/",
              },
            ],
            existing: true,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
