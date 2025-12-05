import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const isAuthenticated = async (role) => {
  try {
    const cookieStore = await cookies();
    const hasToken = cookieStore.has("access_token");
    console.log("Key Auth Debug: Has Token?", hasToken);

    if (!hasToken) {
      return {
        isAuth: false,
      };
    }
    const access_token = cookieStore.get("access_token");
    const { payload } = await jwtVerify(
      access_token.value,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );
    console.log(
      "Key Auth Debug: Payload Role:",
      payload.role,
      "Required Role:",
      role
    );

    if (role && payload.role !== role) {
      return {
        isAuth: false,
      };
    }
    return {
      isAuth: true,
      userId: payload._id,
      _id: payload._id,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    return {
      isAuth: false,
      error,
    };
  }
};
