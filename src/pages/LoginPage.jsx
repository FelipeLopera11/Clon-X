import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { loginUser, loginWithGoogle } from "../auth";

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginUser(username, password);

    setLoading(false);

    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    const result = await loginWithGoogle();

    setLoading(false);

    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Iniciar sesión en Clon-X</h2>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre de usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>
              </form>

              <div className="text-center my-3">o</div>

              <button
                type="button"
                className="btn btn-outline-dark w-100"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                Continuar con Google
              </button>

              <p className="text-center mt-3 mb-0">
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;