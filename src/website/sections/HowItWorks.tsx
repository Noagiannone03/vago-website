import './HowItWorks.css';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section how-it-works-section">
      <div className="how-header">
        <span className="how-emoji">🎯</span>
        <h2 className="section-title">Comment ça marche ?</h2>
        <p className="section-subtitle">
          Un gameplay simple mais addictif qui mélange simulation passive et mini-jeux actifs
        </p>
      </div>

      <div className="how-grid">
        <div className="how-card card">
          <div className="how-card-number">01</div>
          <div className="how-card-icon">🚚</div>
          <h3 className="how-card-title">Choisissez une mission</h3>
          <p className="how-card-text">
            Sélectionnez un trajet de livraison (colis, nourriture, documents).
            Chaque mission a une durée et une récompense en Miles.
          </p>
        </div>

        <div className="how-card card">
          <div className="how-card-number">02</div>
          <div className="how-card-icon">⏱️</div>
          <h3 className="how-card-title">Le trajet progresse</h3>
          <p className="how-card-text">
            Votre mission avance automatiquement en temps réel, même quand vous fermez l'app.
            Pas besoin de rester scotché à l'écran !
          </p>
        </div>

        <div className="how-card card">
          <div className="how-card-number">03</div>
          <div className="how-card-icon">⚠️</div>
          <h3 className="how-card-title">Gérez les événements</h3>
          <p className="how-card-text">
            Des obstacles aléatoires (pannes, embouteillages) mettent le trajet en pause.
            Réussissez les mini-jeux pour repartir !
          </p>
        </div>

        <div className="how-card card">
          <div className="how-card-number">04</div>
          <div className="how-card-icon">⛽</div>
          <h3 className="how-card-title">Surveillez vos jauges</h3>
          <p className="how-card-text">
            Le Carburant et l'Énergie se vident avec le temps. Anticipez et revenez
            faire le plein avant qu'il ne soit trop tard !
          </p>
        </div>

        <div className="how-card card">
          <div className="how-card-number">05</div>
          <div className="how-card-icon">📦</div>
          <h3 className="how-card-title">Trouvez des boîtes</h3>
          <p className="how-card-text">
            Débloquez des items stratégiques : Boost de vitesse, Passe-partout,
            Jerrycan d'essence... pour optimiser vos gains.
          </p>
        </div>

        <div className="how-card card">
          <div className="how-card-number">06</div>
          <div className="how-card-icon">🎁</div>
          <h3 className="how-card-title">Échangez vos Miles</h3>
          <p className="how-card-text">
            Accumulez des Miles et convertissez-les en vraies récompenses :
            pleins d'essence, cartes cadeaux, et plus encore !
          </p>
        </div>
      </div>

      <div className="how-footer">
        <div className="how-footer-content card">
          <h3>🎮 Un jeu équilibré</h3>
          <p>
            Vago combine progression passive et interactions actives pour créer une boucle
            de jeu motivante. Vous n'êtes pas obligé de jouer 24/7, mais votre engagement
            est récompensé par de vraies économies !
          </p>
        </div>
      </div>
    </section>
  );
}
