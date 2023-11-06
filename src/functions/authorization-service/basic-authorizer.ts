const getPolicy = (principalId: string, effect: "Allow" | "Deny") => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: `arn:aws:execute-api:*:*:*`,
      },
    ],
  },
});

export const basicAuthorizer = async (event) => {
  const authHeader = event.headers.Authorization;
  const authTokenEncoded = authHeader.split(" ")[1];
  const authTokenDecoded = Buffer.from(authTokenEncoded, "base64").toString(
    "ascii"
  );
  const user = authTokenDecoded.split(":")[0];
  const password = authTokenDecoded.split(":")[1];
  console.log(user);
  console.log(password);

  if (user == process.env.user && password == process.env.password) {
    return getPolicy(user, "Allow");
  }
  return getPolicy(user, "Deny");
};
