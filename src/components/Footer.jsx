const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#0f1623',
        borderTop: '1px solid rgba(72, 199, 170, 0.2)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        flexWrap: 'wrap',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '13px',
          color: '#6b7fa3',
          letterSpacing: '0.3px',
        }}
      >
        © {currentYear}{' '}
        <span
          style={{
            color: '#48c7aa',
            fontWeight: '600',
          }}
        >
          SAGE-Desa
        </span>
        {' '}— Developed by{' '}
        <span style={{ color: '#fcb5e7ff', fontWeight: '500' }}>
          Firmanda &amp; Rike
        </span>
      </p>
    </footer>
  );
};

export default Footer;
