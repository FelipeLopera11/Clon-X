
import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from "react-router";

import HomePage from "./pages/HomePage";
import ComposePage from "./pages/ComposePage";
import FeedPage from "./pages/FeedPage";
import FollowingPage from "./pages/FollowingPage";
import FollowersPage from "./pages/FollowersPage";
import UserTweetsPage from "./pages/UserTweetsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

import {
  subscribeToAuthChanges,
  logoutUser,
} from "./auth";

function GuestRoute({ currentUser, children }) {
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/register" replace />;
  }

  return children;
}

function PlaceholderPage({ title, description }) {
  return (
    <section className="container py-5">
      <div className="card bg-dark text-white border-secondary">
        <div className="card-body p-4">
          <h1 className="h3">{title}</h1>
          <p className="text-secondary mb-0">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

function PageLayout({ children }) {
  return (
    <main className="container py-4">
      {children}
    </main>
  );
}

function AppHeader({ currentUser }) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const result = await logoutUser();

      if (result?.success === false) {
        console.error("Error al cerrar sesión:", result.message);
        return;
      }

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <header className="container-fluid bg-dark border-bottom border-secondary py-3">
      <nav className="container d-flex flex-wrap align-items-center justify-content-between gap-3">

        <Link
          to="/home"
          className="text-white text-decoration-none fw-bold fs-4"
        >
          Clon-X
        </Link>

        <div className="d-flex flex-wrap align-items-center gap-3">

          <NavLink
            to="/home"
            className="text-white text-decoration-none"
          >
            Inicio
          </NavLink>

          <NavLink
            to="/compose"
            className="text-white text-decoration-none"
          >
            Publicar
          </NavLink>

          <NavLink
            to="/feed"
            className="text-white text-decoration-none"
          >
            Feed
          </NavLink>

          <NavLink
            to="/following"
            className="text-white text-decoration-none"
          >
            Seguidos
          </NavLink>

          <NavLink
            to="/followers"
            className="text-white text-decoration-none"
          >
            Seguidores
          </NavLink>

          <span className="text-info">
            @{currentUser.username}
          </span>

          <button
            className="btn btn-outline-light btn-sm"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>

        </div>
      </nav>
    </header>
  );
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 bg-black text-white d-flex align-items-center justify-content-center">
        Cargando Clon-X...
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 bg-black text-white p-0">

      {currentUser && (
        <AppHeader currentUser={currentUser} />
      )}

      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to={currentUser ? "/home" : "/register"}
              replace
            />
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute currentUser={currentUser}>
              <RegisterPage />
            </GuestRoute>
          }
        />

        <Route
          path="/login"
          element={
            <GuestRoute currentUser={currentUser}>
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <HomePage currentUser={currentUser} />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/compose"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <ComposePage currentUser={currentUser} />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/feed"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <FeedPage currentUser={currentUser} />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/following"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <FollowingPage currentUser={currentUser} />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/followers"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <FollowersPage currentUser={currentUser} />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:username"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <UserTweetsPage currentUser={currentUser} />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            currentUser ? (
              <PageLayout>
                <PlaceholderPage
                  title="Página no encontrada"
                  description="Usa el menú para volver a una sección del proyecto."
                />
              </PageLayout>
            ) : (
              <Navigate to="/register" replace />
            )
          }
        />

      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
