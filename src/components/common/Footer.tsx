import React from 'react';

const footerStyle: React.CSSProperties = {
  padding: '1.5rem',
  textAlign: 'center',
  background: 'var(--card-bg)',
  borderTop: '1px solid var(--border)',
  color: 'var(--text-muted)',
  fontSize: '0.875rem'
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={footerStyle}>
      <p>&copy; {currentYear} Inventarium - Todos os direitos reservados. Gestão de Estoque Profissional.</p>
    </footer>
  );
}
