import { getProductsList, getProductById } from "@functions/product-service";
const serverlessConfiguration = {
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
    functions: { getProductsList, getProductById },
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
                        {
                            AttributeName: "price",
                            AttributeType: "N",
                        },
                        {
                            AttributeName: "description",
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
                            KeyType: "HASH",
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
                            KeyType: "HASH",
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
//# sourceMappingURL=serverless.js.map