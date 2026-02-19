import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    function handleScroll() {
      setVisible(main!.scrollTop > 300);
    }
    main.addEventListener('scroll', handleScroll, { passive: true });
    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 rounded-full bg-stone-200 p-3 text-stone-600 shadow-xl transition-opacity hover:bg-stone-300 active:bg-stone-400 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      aria-label="回到頂端"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  );
}
