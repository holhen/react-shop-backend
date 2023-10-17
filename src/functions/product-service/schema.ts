export default {
  type: "object",
  properties: {
    product: {
      id: "string",
      title: "string",
      description: "string",
      price: "number",
    },
  },
  required: ["product"],
} as const;
