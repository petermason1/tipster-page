import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      padding: '1rem',
      background: '#222',
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1>🐎 Horse Tips</h1>
      <nav>
        <Link href="/" style={{ color: '#fff', marginRight: '1rem' }}>Results</Link>
        <Link href="/racecards" style={{ color: '#fff' }}>Racecards</Link>
      </nav>
    </header>
  );
}
