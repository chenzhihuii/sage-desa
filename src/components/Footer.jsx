const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-green-100 dark:border-[rgba(72,199,170,0.2)] bg-gray-100 dark:bg-[#0f1623] px-8 py-4 flex items-center justify-center flex-wrap gap-1.5">
      <p className="m-0 text-[13px] text-gray-500 dark:text-[#6b7fa3] tracking-[0.3px]">
        © {currentYear}{' '}
        <span className="text-green-500 dark:text-[#48c7aa] font-semibold">SAGE-Desa</span>
        {' '}— Developed by{' '}
        <span className="text-pink-400 dark:text-[#fcb5e7ff] font-medium">Firmanda &amp; Rike</span>
      </p>
    </footer>
  );
};

export default Footer;
