import './Solution.css';

export function Solution() {
  return (
    <section className="section solution-section">
      <div className="solution-header">
        <span className="solution-emoji">💡</span>
        <h2 className="section-title">On vous aide à économiser</h2>
        <p className="section-subtitle">
          Avec Vago, réduisez vos dépenses d'essence grâce à un jeu simple.
          On transforme votre temps de jeu en vraies économies pour alléger votre budget.
        </p>
      </div>

      <div className="solution-content">
        <div className="solution-left">
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">🎮</div>
              <div className="feature-content">
                <h3 className="feature-title">Jouez et progressez</h3>
                <p className="feature-text">
                  Incarnez un livreur de colis et effectuez des trajets virtuels.
                  Chaque mission vous rapporte des Miles, notre monnaie virtuelle.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-content">
                <h3 className="feature-title">Actif et passif</h3>
                <p className="feature-text">
                  Vos trajets progressent en temps réel, même quand l'app est fermée.
                  Revenez gérer les événements et maximisez vos gains.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🎁</div>
              <div className="feature-content">
                <h3 className="feature-title">Échangez vos Miles</h3>
                <p className="feature-text">
                  Convertissez vos Miles en vraies récompenses : pleins d'essence,
                  cartes cadeaux, et bien plus encore.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="solution-right">
          <div className="solution-box card">
            <div className="solution-box-header">
              <h3>Exemple concret</h3>
            </div>
            <div className="solution-box-content">
              <div className="example-step">
                <span className="step-number">1</span>
                <p>Lancez une mission "Livraison Express"</p>
              </div>
              <div className="example-arrow">→</div>
              <div className="example-step">
                <span className="step-number">2</span>
                <p>Gérez les événements et mini-jeux</p>
              </div>
              <div className="example-arrow">→</div>
              <div className="example-step">
                <span className="step-number">3</span>
                <p>Gagnez +450 Miles</p>
              </div>
              <div className="example-arrow">→</div>
              <div className="example-step reward-step">
                <span className="reward-icon">⛽</span>
                <p><strong>= Économies réelles</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
