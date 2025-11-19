import '../styles/AboutPage.css'

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <header className="page-header">
          <h1>🎅 Over Pien & Deze Website</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>Wie ben ik?</h2>
            <p>
              Hoi! Ik ben Pien, en ik ben een beetje (heel erg) geobsedeerd met kerstfilms.
              Elk jaar vanaf half november begin ik met het kijken van kerstfilms,
              en voor ik het weet heb ik er al 30+ gezien voordat december überhaupt begonnen is!
            </p>
          </section>

          <section className="about-section">
            <h2>🎄 Waarom kerstfilms?</h2>
            <p>
              Er is gewoon iets magisch aan kerstfilms. Of ze nu hartverwarmend
              romantisch zijn, hilarisch slecht, of onverwacht goed - ze brengen
              me altijd in de kerstsfeer. En zoals je misschien gemerkt hebt,
              kijk ik ze ALLEMAAL. De goede, de slechte, en de "waarom bestaat dit?"
            </p>
          </section>

          <section className="about-section">
            <h2>🐱 Het Arty Rating Systeem</h2>
            <p>
              Iedere film krijgt een rating van 1 tot 10 Arty-koppen.
              Arty is mijn lieve kat die meestal naast me op de bank ligt
              tijdens mijn kerstfilm marathons. Als hij blijft liggen tijdens
              een film, weet je dat het een goede is!
            </p>
            <p>
              <strong>De schaal:</strong>
            </p>
            <ul>
              <li><strong>1-3 Arty's:</strong> Zelfs Arty liep weg. Niet aanraden.</li>
              <li><strong>4-6 Arty's:</strong> Prima voor op de achtergrond, maar vergeetbaar.</li>
              <li><strong>7-8 Arty's:</strong> Echt leuk! Zeker de moeite waard.</li>
              <li><strong>9-10 Arty's:</strong> Absolute must-watch! Instant klassieker!</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>📬 Contact</h2>
            <p>
              Heb je vragen, suggesties, of wil je gewoon kerstfilm tips uitwisselen?
              Stuur me een berichtje!
            </p>
            <p className="contact-note">
              (Contact informatie kan hier toegevoegd worden)
            </p>
          </section>

          <div className="about-footer">
            <p>🎄 Fijne kersttijd & veel kijkplezier! ❄️</p>
            <p className="signature">- Pien (& Arty 🐱)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

