import './Features.css';

export function Features() {
  return (
    <section className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Simple et efficace</h2>
          <p className="features-subtitle">
            Gagnez des Miles en jouant, échangez-les contre de l'essence
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3 className="feature-title">Jouez et progressez</h3>
            <p className="feature-text">
              Livrez des colis virtuels, gérez les événements et gagnez des Miles à chaque trajet terminé.
            </p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 className="feature-title">Progression passive</h3>
            <p className="feature-text">
              Vos trajets avancent en temps réel, même quand l'app est fermée. Revenez pour les événements.
            </p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 className="feature-title">Récompenses réelles</h3>
            <p className="feature-text">
              Échangez vos Miles contre des pleins d'essence gratuits et d'autres récompenses concrètes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
