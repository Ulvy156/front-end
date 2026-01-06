import axios from "axios";

export default async function refreshToken() {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );

    if (data?.accessToken) {
      // store it
      useCookie(
        "access_token",
        data.accessToken,
      );
      // store is_logged

      // return it for axios interceptor
      return data.accessToken;
    }

    // set user to logged out
    console.warn("⚠️ No access token returned from refresh endpoint");
    return null;
  } catch (err) {
    console.error("❌ Token refresh failed:", err);
    return null;
  }
}
