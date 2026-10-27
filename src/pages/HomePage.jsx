
import { Link } from "react-router";
import { currentUser } from "../data/mockData";

function HomePage() {
  return (
    <>
      <section className="mb-4">
        <p className="text-primary fw-semibold mb-1">
          Tu espacio en Clon-X
        </p>
        <h1 className="h3 text-white mb-1">
          Hola, {currentUser.fullName}
        </h1>
        <p className="text-white-50 mb-3">
          @{currentUser.username}
        </p>

        <Link className="btn btn-primary rounded-pill px-4" to="/compose">
          Publicar un tweet
        </Link>
      </section>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <section className="card bg-dark text-white border-secondary rounded-4 h-100">
            <div className="card-body p-4">
              <h2 className="h6 text-white-50">Seguidores</h2>
              <p className="display-6 fw-bold mb-3">
                {currentUser.followersCount.toLocaleString("es-CO")}
              </p>
              <Link className="text-info text-decoration-none" to="/followers">
                Ver seguidores
              </Link>
            </div>
          </section>
        </div>

        <div className="col-12 col-md-6">
          <section className="card bg-dark text-white border-secondary rounded-4 h-100">
            <div className="card-body p-4">
              <h2 className="h6 text-white-50">Siguiendo</h2>
              <p className="display-6 fw-bold mb-3">
                {currentUser.followingCount.toLocaleString("es-CO")}
              </p>
              <Link className="text-info text-decoration-none" to="/following">
                Ver usuarios seguidos
              </Link>
            </div>
          </section>
        </div>

        <div className="col-12">
          <section className="card bg-dark text-white border-secondary rounded-4">
            <div className="card-body p-4">
              <h2 className="h5 text-white">Mantente al dia</h2>
              <p className="text-white-50">
                Revisa las publicaciones recientes de tu comunidad.
              </p>
              <Link className="btn btn-outline-info rounded-pill" to="/feed">
                Ir al feed
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default HomePage;
