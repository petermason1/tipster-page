import Link from 'next/link';
import styles from './Home.module.css';

export default function HomePage() {
  return (
    <main className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.headline}>Daily Racing Insights</h1>
        <p className={styles.subheadline}>
          Value picks. Data-driven bets. No fluff — just smart racing analysis.
        </p>
        <div className={styles.ctas}>
          <Link href="/racecards" className={styles.button}>🗓️ Today’s Racecards</Link>
          <Link href="/results" className={styles.buttonAlt}>📊 Yesterday’s Results</Link>
        </div>
      </section>

      {/* Deals Section */}
      <section className={styles.deals}>
        <h2>🎁 Top Racing Deals</h2>
        <ul className={styles.dealList}>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              🏇 Bet £10 Get £30 – RacingSignUp.co.uk
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              🍻 Cheltenham Gold Cup Weekend – £99pp
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              🏖️ Racing & Sun: Dubai Winter Tour Packages
            </a>
          </li>
        </ul>
      </section>

      {/* Blog Section */}
      <section className={styles.blog}>
        <h2>🧠 Latest Insights</h2>
        <ul className={styles.blogList}>
          <li><Link href="/blog/fridays-handicaps">🔍 Friday’s Handicaps: Where’s the Value?</Link></li>
          <li><Link href="/blog/trainers-on-fire">📊 3 Trainers on Fire This Week</Link></li>
          <li><Link href="/blog/brighton-each-way">💰 Each-Way Angles at Brighton</Link></li>
        </ul>
      </section>
    </main>
  );
}
