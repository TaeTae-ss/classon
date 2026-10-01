import { RouterProvider } from "react-router";
import root from "./router/root.jsx";

const App = () => {
  return <RouterProvider router={root} />;
}

export default App;