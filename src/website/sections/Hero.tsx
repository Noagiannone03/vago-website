import './Hero.css';

export function Hero() {
  return (
    <section className="hero">
      <nav className="nav">
        <div className="nav-content">
          <div className="logo">VAGO</div>
          <a href="/admin" className="nav-link">Admin</a>
        </div>
      </nav>

      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Jouez.<br />
            Gagnez.<br />
            <span className="highlight">Roulez gratuit.</span>
          </h1>

          <p className="hero-description">
            La première app qui transforme votre temps de jeu en pleins d'essence gratuits.
          </p>

          <div className="hero-cta">
            <a href="#download" className="btn btn-primary btn-large">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Télécharger
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="phone-frame">
            <div className="phone-screen">
              <div className="game-ui">
                <div className="ui-header">
                  <span className="ui-title">Livraison Express</span>
                  <span className="ui-miles">+450</span>
                </div>
                <div className="ui-progress">
                  <div className="progress"></div>
                </div>
                <div className="ui-stats">
                  <div className="stat">
                    <div className="stat-label">Carburant</div>
                    <div className="stat-bar"><div className="bar" style={{width: '75%'}}></div></div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Énergie</div>
                    <div className="stat-bar"><div className="bar" style={{width: '60%'}}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
