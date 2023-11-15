import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "authorization-service",
  useDotenv: true,
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
  functions: {
    basicAuthorizer: {
      handler: "./basic-authorizer.basicAuthorizer",
      environment: {
        user: "holhen",
        password: "${env:holhen}",
      },
    },
  },
};

module.exports = serverlessConfiguration;
