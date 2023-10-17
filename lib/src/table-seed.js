import { BatchWriteItemCommand, DynamoDBClient, } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({
    region: "eu-north-1",
});
export const tableSeeder = async () => {
    const command = new BatchWriteItemCommand({
        RequestItems: {
            products: [
                {
                    PutRequest: {
                        Item: {
                            description: {
                                S: "Short Product Description1",
                            },
                            id: {
                                S: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
                            },
                            price: {
                                N: "24",
                            },
                            title: {
                                S: "ProductOne",
                            },
                        },
                    },
                },
                {
                    PutRequest: {
                        Item: {
                            description: {
                                S: "Short Product Description7",
                            },
                            id: {
                                S: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
                            },
                            price: {
                                N: "15",
                            },
                            title: {
                                S: "ProductTitle",
                            },
                        },
                    },
                },
                {
                    PutRequest: {
                        Item: {
                            description: {
                                S: "Short Product Description2",
                            },
                            id: {
                                S: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
                            },
                            price: {
                                N: "23",
                            },
                            title: {
                                S: "Product",
                            },
                        },
                    },
                },
                {
                    PutRequest: {
                        Item: {
                            description: {
                                S: "Short Product Description4",
                            },
                            id: {
                                S: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
                            },
                            price: {
                                N: "32",
                            },
                            title: {
                                S: "Product2",
                            },
                        },
                    },
                },
                {
                    PutRequest: {
                        Item: {
                            description: {
                                S: "Short Product Description5",
                            },
                            id: {
                                S: "7567ec4b-b10c-48c5-9345-fc73c48a80a5",
                            },
                            price: {
                                N: "41",
                            },
                            title: {
                                S: "ProductTitle3",
                            },
                        },
                    },
                },
                {
                    PutRequest: {
                        Item: {
                            description: {
                                S: "Short Product Description8",
                            },
                            id: {
                                S: "7567ec4b-b10c-48c5-9345-fc73c48a80a8",
                            },
                            price: {
                                N: "12",
                            },
                            title: {
                                S: "ProductTitle4",
                            },
                        },
                    },
                },
            ],
            stocks: [
                {
                    PutRequest: {
                        Item: {
                            product_id: {
                                S: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
                            },
                            count: {
                                N: "3",
                            },
                        },
                    },
                },
                {
                    PutRequest: {
                        Item: {
                            product_id: {
                                S: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
                            },
                            count: {
                                N: "5",
                            },
                        },
                    },
                },
                {
                    PutRequest: {
                        Item: {
                            product_id: {
                                S: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
                            },
                            count: {
                                N: "5",
                            },
                        },
                    },
                },
                {
                    PutRequest: {
                        Item: {
                            product_id: {
                                S: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
                            },
                            count: {
                                N: "10",
                            },
                        },
                    },
                },
                {
                    PutRequest: {
                        Item: {
                            product_id: {
                                S: "7567ec4b-b10c-48c5-9345-fc73c48a80a5",
                            },
                            count: {
                                N: "8",
                            },
                        },
                    },
                },
                {
                    PutRequest: {
                        Item: {
                            product_id: {
                                S: "7567ec4b-b10c-48c5-9345-fc73c48a80a8",
                            },
                            count: {
                                N: "4",
                            },
                        },
                    },
                },
            ],
        },
    });
    const response = await client.send(command);
    console.log(response);
    return response;
};
tableSeeder();
//# sourceMappingURL=table-seed.js.map