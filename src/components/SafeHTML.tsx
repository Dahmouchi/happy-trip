'use client';

import { useEffect, useState } from 'react';
import createDOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

const SafeHTML = ({ html, className }: SafeHTMLProps) => {
  const [cleanHTML, setCleanHTML] = useState('');

  useEffect(() => {
    const DOMPurify = createDOMPurify(window);
    setCleanHTML(DOMPurify.sanitize(html));
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
};

export default SafeHTML;
