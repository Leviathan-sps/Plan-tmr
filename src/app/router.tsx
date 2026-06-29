// route table. landing is the front door, the rest is the actual app.
// note: react needs component names capitalized, so these few stay PascalCase.

import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Landing from "../pages/landing";
import Plan from "../pages/plan";
import Home from "../pages/home";
import Progress from "../pages/progress";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <Landing /> },
        { path: "plan", element: <Plan /> },
        { path: "today", element: <Home /> },
        { path: "progress", element: <Progress /> },
      ],
    },
  ],
  // "/" in dev, "/Plan-tmr/" on pages — keeps links inside the repo path
  { basename: import.meta.env.BASE_URL },
);
