import { reactive } from "vue";
// Helper to get user info from server
export async function getemailFromServer() {
  try {
    const res = await fetch("http://localhost:3000/api/me", {
      credentials: "include", // send cookies
    });
    if (res.ok) {
      const data = await res.json();
      return data.email; // or data.email, etc.
    }
    return null;
  } catch (e) {
    return null;
  }
}
export const auth = reactive({
  isLoggedIn: !!localStorage.getItem("token"),
});
