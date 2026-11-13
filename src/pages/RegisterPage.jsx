
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../auth";

function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    const userData = {
      fullName: formData.get("fullName").trim(),
      username: formData.get("username").trim().replace(/^@/, ""),
      email: formData.get("email").trim().toLowerCase(),
      password: formData.get("password"),
    };

    // Validar contraseña
    if (userData.password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    // Validar nombre de usuario
    if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      setError(
        "El usuario solo puede contener letras, números y guiones bajos."
      );
      return;
    }

    // Registrar usuario en LocalStorage
    const result = registerUser(userData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Redirigir al inicio
    navigate("/home");
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <section className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <span className="badge rounded-pill text-bg-primary mb-3">
                  Clon de X
                </span>

                <h1 className="h3 mb-2">Crear cuenta</h1>

                <p className="text-secondary mb-0">
                  Regístrate para unirte a la conversación.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="fullName">
                    Nombre completo
                  </label>

                  <input
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Escribe tu nombre completo"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="username">
                    Nombre de usuario
                  </label>

                  <input
                    className="form-control"
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Por ejemplo, oscar"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Correo electrónico
                  </label>

                  <input
                    className="form-control"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@correo.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="password">
                    Contraseña
                  </label>

                  <input
                    className="form-control"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Crea una contraseña"
                    minLength={6}
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <button className="btn btn-primary w-100" type="submit">
                  Registrarse
                </button>
              </form>

              <p className="text-center text-secondary mt-4 mb-0">
                ¿Ya tienes una cuenta?{" "}
                <Link className="text-decoration-none" to="/login">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
