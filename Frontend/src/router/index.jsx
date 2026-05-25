import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/templates/MainLayout";
import ProtectedRoute from "../components/templates/ProtectedRoute";
import Dashboard from "../components/pages/Dashboard";
import SongsCatalog from "../components/pages/SongsCatalog";
import MinistriesDirectory from "../components/pages/MinistriesDirectory";
import SetlistDetail from "../components/pages/SetlistDetail";
import Profile from "../components/pages/Profile";
import Login from "../components/pages/Login";
import Register from "../components/pages/Register";
import NotFound from "../components/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "songs",
            element: <SongsCatalog />,
          },
          {
            path: "ministers",
            element: <MinistriesDirectory />,
          },
          {
            path: "setlist/:id",
            element: <SetlistDetail />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "profile/:userId",
            element: <Profile />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);

export default router;
