import React, { useRef, useEffect } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => {
        if(card) {
            card.removeEventListener('mousemove', handleMouseMove);
        }
    };
  }, []);
  
  const baseClasses = `
    bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-lg 
    border border-slate-700 p-6 glow-border card-3d
  `;
  
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div ref={cardRef} className={`${baseClasses} ${clickableClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;