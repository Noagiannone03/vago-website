import './Hero.css';

export function Hero() {
  return (
    <section className="hero">
      <nav className="hero-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🚗</span>
            <span className="logo-text">VAGO</span>
          </div>
          <a href="/admin" className="btn-nav">Admin</a>
        </div>
      </nav>

      <div className="hero-content">
        <div className="hero-badge">
          <span>✨ Le jeu qui paie votre essence</span>
        </div>

        <h1 className="hero-title">
          Transformez votre<br />
          <span className="hero-title-highlight">temps de jeu</span><br />
          en pouvoir d'achat
        </h1>

        <p className="hero-description">
          Vago est la première application de simulation de conduite qui vous permet
          de gagner de vraies récompenses en jouant. Votre essence, payée en s'amusant.
        </p>

        <div className="hero-cta">
          <a href="#download" className="btn btn-primary btn-large">
            Télécharger l'app
          </a>
          <a href="#how-it-works" className="btn btn-secondary btn-large">
            Comment ça marche
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-number">100%</div>
              <div className="stat-label">Gratuit</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⛽</div>
            <div className="stat-content">
              <div className="stat-number">€€€</div>
              <div className="stat-label">Vraies économies</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-number">Simple</div>
              <div className="stat-label">Facile à utiliser</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-image">
        <div className="phone-mockup">
          <div className="phone-screen">
            <div className="game-demo">
              <div className="demo-header">
                <span>🚚 Livraison Express</span>
                <span className="demo-miles">+450 Miles</span>
              </div>
              <div className="demo-progress">
                <div className="progress-bar"></div>
              </div>
              <div className="demo-gauges">
                <div className="gauge">
                  <span>⛽ Carburant</span>
                  <div className="gauge-bar"></div>
                </div>
                <div className="gauge">
                  <span>⚡ Énergie</span>
                  <div className="gauge-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
