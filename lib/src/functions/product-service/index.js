import { handlerPath } from "@libs/handler-resolver";
export const getProductsList = {
    handler: `${handlerPath(__dirname)}/get-products-list.getProductsList`,
    events: [
        {
            http: {
                method: "get",
                path: "getProductsList",
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
                path: "getProductById/{productId}",
            },
        },
    ],
    url: {
        cors: true,
    },
};
//# sourceMappingURL=index.js.map