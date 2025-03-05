import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@clerk/types";

const client = jwksClient({
  jwksUri: `${process.env.CLERK_APP_URL}/.well-known/jwks.json`,
  requestHeaders: {},
  timeout: 30000,
});

let signingKey: string | undefined = undefined;

async function verifyToken(token: string) {
  const header = token.split(".")[0];
  const decodedHeader = JSON.parse(atob(header));
  const kid = decodedHeader.kid;
  const signingKey = await getSigningKey(kid);
  try {
    const verifiedDecoded = jwt.verify(token, signingKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    const currentTime = Math.floor(Date.now() / 1000);
    if (
      verifiedDecoded.exp < currentTime ||
      verifiedDecoded.nbf > currentTime ||
      verifiedDecoded.iss !== process.env.CLERK_APP_URL
    ) {
      throw new Error("Token is expired or not yet valid");
    }

    return verifiedDecoded;
  } catch (error) {
    return null;
  }
}

async function getSigningKey(kid: string) {
  if (signingKey) {
    return signingKey;
  }
  const key = await client.getSigningKey(kid);
  signingKey = key.getPublicKey();
  return signingKey;
}

export function createAuthenticatedEndpoint(
  handler: (request: Request, userId: string) => Promise<Response>
) {
  return async (request: Request) => {
    const tokenString = request.headers.get("authorization");
    const token = tokenString?.split(" ")[1];
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const decoded = await verifyToken(token);
    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userId = decoded.sub;
    return handler(request, userId);
  };
}
