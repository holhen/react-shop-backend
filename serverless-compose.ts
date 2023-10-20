const serverlessConfiguration = {
  services: {
    products: {
      path: "./src/functions/product-service",
    },
    import: {
      path: "./src/functions/import-service",
    },
  },
};

module.exports = serverlessConfiguration;
