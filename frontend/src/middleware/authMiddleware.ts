import { redirect } from "react-router-dom";

export async function authMiddleware() {
  // const isAuth = localStorage.getItem("token"); // contoh cek dari token
  const isAuth = true;
  if (!isAuth) {
    return redirect("/login");
  }
}
