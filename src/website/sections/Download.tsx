import './Download.css';

export function Download() {
  return (
    <section id="download" className="section download-section">
      <div className="download-container">
        <div className="download-content">
          <span className="download-emoji">🚀</span>
          <h2 className="download-title">Réduisez vos dépenses<br />d'essence dès aujourd'hui</h2>
          <p className="download-text">
            Téléchargez Vago gratuitement et commencez à économiser sur votre carburant.
            On vous aide à alléger votre budget avec de vraies récompenses !
          </p>

          <div className="download-buttons">
            <a href="#" className="store-button card">
              <div className="store-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </div>
              <div className="store-text">
                <div className="store-label">Télécharger sur</div>
                <div className="store-name">App Store</div>
              </div>
            </a>

            <a href="#" className="store-button card">
              <div className="store-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
              </div>
              <div className="store-text">
                <div className="store-label">Disponible sur</div>
                <div className="store-name">Google Play</div>
              </div>
            </a>
          </div>

          <div className="download-notice">
            <p>🎁 <strong>Bonus de bienvenue :</strong> +1000 Miles offerts à l'inscription !</p>
          </div>
        </div>

        <div className="download-stats">
          <div className="stat-box card">
            <div className="stat-box-icon">🎮</div>
            <div className="stat-box-number">100%</div>
            <div className="stat-box-label">Gratuit</div>
          </div>

          <div className="stat-box card">
            <div className="stat-box-icon">⚡</div>
            <div className="stat-box-number">0</div>
            <div className="stat-box-label">Pub forcée</div>
          </div>

          <div className="stat-box card">
            <div className="stat-box-icon">🔒</div>
            <div className="stat-box-number">100%</div>
            <div className="stat-box-label">Sécurisé</div>
          </div>
        </div>
      </div>
    </section>
  );
}
