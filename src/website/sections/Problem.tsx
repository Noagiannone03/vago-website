import './Problem.css';

export function Problem() {
  return (
    <section className="section problem-section">
      <div className="problem-header">
        <span className="problem-emoji">😰</span>
        <h2 className="section-title">Votre budget essence<br />vous pèse ?</h2>
        <p className="section-subtitle">
          Pour des millions de Français, payer l'essence chaque semaine devient un vrai problème.
          On comprend, c'est pour ça qu'on a créé Vago : pour vous aider.
        </p>
      </div>

      <div className="problem-grid">
        <div className="problem-card card">
          <div className="problem-card-icon">📈</div>
          <h3 className="problem-card-title">Prix volatils</h3>
          <p className="problem-card-text">
            Les prix à la pompe fluctuent constamment et pèsent lourdement sur les fins de mois.
            Une source de stress permanente pour les conducteurs.
          </p>
        </div>

        <div className="problem-card card">
          <div className="problem-card-icon">🚗</div>
          <h3 className="problem-card-title">Indispensable</h3>
          <p className="problem-card-text">
            La voiture n'est plus un luxe, c'est une nécessité pour accéder à l'emploi.
            Impossible de s'en passer, surtout pour les étudiants et jeunes actifs.
          </p>
        </div>

        <div className="problem-card card">
          <div className="problem-card-icon">💸</div>
          <h3 className="problem-card-title">Aucun levier</h3>
          <p className="problem-card-text">
            Contrairement à d'autres dépenses, il n'existe quasiment aucune solution pour
            réduire le coût de l'essence au quotidien.
          </p>
        </div>
      </div>

      <div className="problem-quote">
        <div className="quote-content">
          <p className="quote-text">
            "C'est l'anxiété au moment de remplir un CV, en se demandant si ne pas cocher
            la case 'véhiculé' va nous écarter d'office d'une opportunité."
          </p>
          <p className="quote-author">— Noa, fondateur de Vago</p>
        </div>
      </div>
    </section>
  );
}
