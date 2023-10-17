import { formatJSONResponse } from "@libs/api-gateway";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({
    region: "eu-north-1",
});
const getProductCommand = (id) => new GetItemCommand({
    TableName: "products",
    Key: {
        id: {
            S: id,
        },
    },
});
export const getProductById = async (event) => {
    const command = getProductCommand(event.pathParameters.id);
    const response = await client.send(command);
    console.log(response);
    const productItem = response.Item;
    const product = {
        id: productItem.id.S,
        title: productItem.title.S,
        description: productItem.description.S,
        price: parseInt(productItem.price.N),
    };
    return formatJSONResponse(product);
};
//# sourceMappingURL=get-product-by-id.js.map