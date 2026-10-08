import { lazy, Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute";

const ImageAnalysis = lazy(() => import("./pages/ImageAnalysis"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const VisionAnalysis = lazy(() => import("./pages/Vision"));
const Almanac = lazy(() => import("./pages/Almanac"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

function App() {

  return (

    <Suspense fallback={<div className="p-6 text-green-400">Loading…</div>}>
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
    </Suspense>
  );
}

export default App;
