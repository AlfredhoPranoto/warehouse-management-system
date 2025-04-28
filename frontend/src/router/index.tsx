import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/Login";
import StaffPage from "../pages/Staff";
import InventoryPage from "../pages/Inventory";
import { authMiddleware } from "../middleware/authMiddleware";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: authMiddleware,
    children: [
      {
        path: "staffs",
        element: <StaffPage />,
      },
      {
        path: "inventory",
        element: <InventoryPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);
