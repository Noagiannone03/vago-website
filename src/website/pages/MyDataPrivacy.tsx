import { useState } from 'react';
import './MyDataPrivacy.css';

export function MyDataPrivacy() {
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState('delete');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implémenter l'envoi de la demande à votre backend
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="data-privacy-page">
      {/* Navigation */}
      <nav className="privacy-nav">
        <div className="privacy-nav-content">
          <a href="/" className="privacy-logo">
            🚗 <span>VAGO</span>
          </a>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="privacy-container">
        <div className="privacy-content">
          <h1 className="privacy-title">Gestion de vos données personnelles</h1>
          <p className="privacy-subtitle">
            Conformément au RGPD et à la loi Informatique et Libertés,
            vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données.
          </p>

          {!submitted ? (
            <>
              <form onSubmit={handleSubmit} className="privacy-form">
                <div className="form-group">
                  <label htmlFor="email">Adresse email associée à votre compte</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="requestType">Type de demande</label>
                  <select
                    id="requestType"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                  >
                    <option value="delete">Suppression de mes données</option>
                    <option value="access">Accès à mes données</option>
                    <option value="rectify">Rectification de mes données</option>
                    <option value="export">Export de mes données</option>
                  </select>
                </div>

                <div className="form-info">
                  {requestType === 'delete' && (
                    <p>⚠️ La suppression entraînera la fermeture définitive de votre compte. Cette action est irréversible.</p>
                  )}
                  {requestType === 'access' && (
                    <p>📋 Vous recevrez un email avec toutes vos données personnelles.</p>
                  )}
                  {requestType === 'rectify' && (
                    <p>✏️ Vous pourrez modifier vos informations depuis votre compte.</p>
                  )}
                  {requestType === 'export' && (
                    <p>📦 Vous recevrez un fichier avec toutes vos données dans un format lisible.</p>
                  )}
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Soumettre ma demande'}
                </button>
              </form>

              <div className="privacy-legal">
                <h2>Vos droits</h2>
                <ul>
                  <li><strong>Droit d'accès :</strong> Accéder aux données que nous détenons sur vous.</li>
                  <li><strong>Droit de rectification :</strong> Corriger vos données inexactes ou incomplètes.</li>
                  <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données.</li>
                  <li><strong>Droit à la portabilité :</strong> Obtenir une copie de vos données.</li>
                  <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données.</li>
                </ul>
                <p className="legal-notice">
                  Délai de traitement : 30 jours maximum. Contact : <a href="mailto:privacy@vago.app">privacy@vago.app</a>
                </p>
              </div>
            </>
          ) : (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h2>Demande envoyée</h2>
              <p>Nous avons bien reçu votre demande. Un email de confirmation a été envoyé à <strong>{email}</strong>.</p>
              <p>Délai de traitement : 30 jours maximum.</p>
              <button onClick={() => window.location.href = '/'}>Retour à l'accueil</button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="privacy-footer">
        <p>© {new Date().getFullYear()} Vago. Tous droits réservés.</p>
        <div className="footer-links">
          <a href="/privacy-policy">Politique de confidentialité</a>
          <a href="/terms">Conditions d'utilisation</a>
        </div>
      </footer>
    </div>
  );
}
