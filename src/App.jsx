
import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router";
import ComposePage from "./pages/ComposePage";
import FeedPage from "./pages/FeedPage";
import FollowersPage from "./pages/FollowersPage";
import FollowingPage from "./pages/FollowingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserTweetsPage from "./pages/UserTweetsPage";

function PlaceholderPage({ title, description }) {
  return (
    <section className="card bg-dark text-white border-secondary rounded-4">
      <div className="card-body p-4">
        <span className="badge text-bg-primary mb-3">
          Milestone 1
        </span>
        <h1 className="h3">{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

function PageLayout({ children }) {
  return (
    <main className="container-fluid px-0 py-4">
      <div className="mx-auto px-3" style={{ maxWidth: "720px" }}>
        {children}
      </div>
    </main>
  );
}

function AppHeader() {
  const navLinkClass = ({ isActive }) =>
    `nav-link rounded-pill px-3 ${
      isActive ? "active bg-secondary text-white" : "text-white-50"
    }`;

  return (
    <header className="navbar navbar-expand bg-black border-bottom border-secondary px-3 py-3">
      <div className="container-fluid flex-wrap gap-3">
        <Link
          className="navbar-brand text-white fw-bold me-2"
          to="/home"
        >
          <span className="border border-2 rounded-circle px-2 py-1 me-2">
            X
          </span>
          Clon-X
        </Link>

        <nav
          className="navbar-nav flex-row flex-wrap gap-1"
          aria-label="Navegación principal"
        >
          <NavLink className={navLinkClass} to="/home">
            Inicio
          </NavLink>
          <NavLink className={navLinkClass} to="/feed">
            Feed
          </NavLink>
          <NavLink className={navLinkClass} to="/following">
            Seguidos
          </NavLink>
          <NavLink className={navLinkClass} to="/followers">
            Seguidores
          </NavLink>
        </nav>

        <div className="d-flex align-items-center gap-3">
          <span className="small fw-bold text-white">@Felipe</span>
          <Link className="small text-white-50" to="/login">
            Cerrar sesión
          </Link>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="container-fluid min-vh-100 bg-black text-white p-0">
        <AppHeader />

        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/home"
            element={<PageLayout><HomePage /></PageLayout>}
          />
          <Route
            path="/compose"
            element={<PageLayout><ComposePage /></PageLayout>}
          />
          <Route
            path="/feed"
            element={<PageLayout><FeedPage /></PageLayout>}
          />
          <Route
            path="/following"
            element={<PageLayout><FollowingPage /></PageLayout>}
          />
          <Route
            path="/followers"
            element={<PageLayout><FollowersPage /></PageLayout>}
          />
          <Route
            path="/users/:username"
            element={<PageLayout><UserTweetsPage /></PageLayout>}
          />

          <Route
            path="*"
            element={
              <PageLayout>
                <PlaceholderPage
                  title="Página no encontrada"
                  description="Usa el menú para volver a una sección del proyecto."
                />
              </PageLayout>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
