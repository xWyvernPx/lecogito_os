
import React from 'react';

export const HighlightText = ({ text, query }: { text?: string; query: string }) => {
    if (!text) return null;
    if (!query) return <>{text}</>;
    
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${safeQuery})`, 'gi'));
    
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-os-accent text-white px-0.5 rounded-sm mx-0.5">{part}</mark> 
            : part
        )}
      </>
    );
};
