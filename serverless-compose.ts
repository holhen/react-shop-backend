const serverlessConfiguration = {
  services: {
    products: {
      path: "./src/functions/product-service",
    },
    import: {
      path: "./src/functions/import-service",
    },
    authorization: {
      path: "./src/functions/authorization-service",
    },
  },
};

module.exports = serverlessConfiguration;
