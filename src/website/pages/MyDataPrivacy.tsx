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
    // Pour l'instant, simulation d'envoi
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="data-privacy-page">
      <nav className="privacy-nav">
        <div className="privacy-nav-content">
          <a href="/" className="privacy-logo">
            <span className="logo-icon">🚗</span>
            <span className="logo-text">VAGO</span>
          </a>
        </div>
      </nav>

      <div className="privacy-container">
        <div className="privacy-content">
          <h1 className="privacy-title">Gestion de vos données personnelles</h1>
          <p className="privacy-subtitle">
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
            vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.
          </p>

          {!submitted ? (
            <div className="privacy-form-container">
              <form onSubmit={handleSubmit} className="privacy-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Adresse email associée à votre compte
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="requestType" className="form-label">
                    Type de demande
                  </label>
                  <select
                    id="requestType"
                    className="form-select"
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
                  <p>
                    {requestType === 'delete' && (
                      <>
                        ⚠️ La suppression de vos données entraînera la fermeture définitive de votre compte Vago.
                        Cette action est irréversible.
                      </>
                    )}
                    {requestType === 'access' && (
                      <>
                        📋 Vous recevrez un email contenant l'ensemble des données personnelles que nous détenons sur vous.
                      </>
                    )}
                    {requestType === 'rectify' && (
                      <>
                        ✏️ Vous pourrez modifier vos informations personnelles directement depuis votre compte.
                      </>
                    )}
                    {requestType === 'export' && (
                      <>
                        📦 Vous recevrez un fichier contenant toutes vos données dans un format structuré et lisible.
                      </>
                    )}
                  </p>
                </div>

                <button type="submit" className="form-submit" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Soumettre ma demande'}
                </button>
              </form>

              <div className="privacy-legal">
                <h2>Vos droits</h2>
                <ul>
                  <li>
                    <strong>Droit d'accès :</strong> Vous pouvez demander à accéder aux données personnelles que nous détenons sur vous.
                  </li>
                  <li>
                    <strong>Droit de rectification :</strong> Vous pouvez demander la correction de vos données inexactes ou incomplètes.
                  </li>
                  <li>
                    <strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données personnelles.
                  </li>
                  <li>
                    <strong>Droit à la portabilité :</strong> Vous pouvez demander une copie de vos données dans un format structuré.
                  </li>
                  <li>
                    <strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données personnelles.
                  </li>
                </ul>

                <p className="legal-notice">
                  Nous nous engageons à traiter votre demande dans un délai maximum de 30 jours conformément à la réglementation en vigueur.
                  Pour toute question, contactez-nous à : <a href="mailto:privacy@vago.app">privacy@vago.app</a>
                </p>
              </div>
            </div>
          ) : (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h2>Demande envoyée avec succès</h2>
              <p>
                Nous avons bien reçu votre demande concernant vos données personnelles.
                Un email de confirmation a été envoyé à <strong>{email}</strong>.
              </p>
              <p>
                Notre équipe traitera votre demande dans les meilleurs délais, conformément aux obligations légales
                (délai maximum de 30 jours).
              </p>
              <button onClick={() => window.location.href = '/'} className="back-button">
                Retour à l'accueil
              </button>
            </div>
          )}
        </div>
      </div>

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
