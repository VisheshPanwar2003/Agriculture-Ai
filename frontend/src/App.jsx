import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import ImageAnalysis from "./pages/ImageAnalysis";
import Chatbot from "./pages/Chatbot";
import VisionAnalysis from "./pages/Vision";
import Almanac from "./pages/Almanac";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Routes>

      {/* PUBLIC ROUTES */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* PROTECTED LAYOUT */}

      <Route
        path="/"
        element={
          <ProtectedRoute>

            <MainLayout />

          </ProtectedRoute>
        }
      >

        {/* HOME */}
        <Route
          index
          element={<ImageAnalysis />}
        />

        {/* CHATBOT */}
        <Route
          path="chatbot"
          element={<Chatbot />}
        />

        {/* VISION */}
        <Route
          path="vision"
          element={<VisionAnalysis />}
        />

        {/* ALMANAC */}
        <Route
          path="almanac"
          element={<Almanac />}
        />

      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;