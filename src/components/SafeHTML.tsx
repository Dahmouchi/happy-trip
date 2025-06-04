import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

const SafeHTML = ({ html, className }: SafeHTMLProps) => {
  const cleanHTML = DOMPurify.sanitize(html);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: cleanHTML }} 
    />
  );
};

export default SafeHTML;