
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
  getCurrentUser,
  logoutUser,
} from "./auth";

// Ruta para usuarios que no han iniciado sesión
function GuestRoute({ currentUser, children }) {
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

// Ruta para usuarios autenticados
function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/register" replace />;
  }

  return children;
}

// Página provisional
function PlaceholderPage({ title, description }) {
  return (
    <section className="container py-5">
      <div className="card bg-dark text-white border-secondary">
        <div className="card-body p-4">
          <h1 className="h3">{title}</h1>
          <p className="text-secondary mb-0">{description}</p>
        </div>
      </div>
    </section>
  );
}

// Diseño de las páginas
function PageLayout({ children }) {
  return (
    <main className="container py-4">
      {children}
    </main>
  );
}

// Encabezado de la aplicación
function AppHeader({ currentUser }) {
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/register");
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
          <NavLink to="/home" className="text-white text-decoration-none">
            Inicio
          </NavLink>

          <NavLink to="/compose" className="text-white text-decoration-none">
            Publicar
          </NavLink>

          <NavLink to="/feed" className="text-white text-decoration-none">
            Feed
          </NavLink>

          <NavLink to="/following" className="text-white text-decoration-none">
            Seguidos
          </NavLink>

          <NavLink to="/followers" className="text-white text-decoration-none">
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

// Contenido principal y rutas
function AppContent() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser);

  useEffect(() => {
    function updateUser() {
      setCurrentUser(getCurrentUser());
    }

    window.addEventListener("clonx-auth-change", updateUser);

    return () => {
      window.removeEventListener("clonx-auth-change", updateUser);
    };
  }, []);

  return (
    <div className="container-fluid min-vh-100 bg-black text-white p-0">

      {currentUser && (
        <AppHeader currentUser={currentUser} />
      )}

      <Routes>
        {/* Ruta principal */}
        <Route
          path="/"
          element={
            <Navigate
              to={currentUser ? "/home" : "/register"}
              replace
            />
          }
        />

        {/* Registro */}
        <Route
          path="/register"
          element={
            <GuestRoute currentUser={currentUser}>
              <RegisterPage />
            </GuestRoute>
          }
        />

        {/* Inicio de sesión */}
        <Route
          path="/login"
          element={
            <GuestRoute currentUser={currentUser}>
              <LoginPage />
            </GuestRoute>
          }
        />

        {/* Inicio */}
        <Route
          path="/home"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <HomePage />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        {/* Publicar */}
        <Route
          path="/compose"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <ComposePage />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        {/* Feed */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <FeedPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        {/* Seguidos */}
        <Route
          path="/following"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <FollowingPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        {/* Seguidores */}
        <Route
          path="/followers"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <FollowersPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        {/* Tweets de un usuario */}
        <Route
          path="/users/:username"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <PageLayout>
                <UserTweetsPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        {/* Página no encontrada */}
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
