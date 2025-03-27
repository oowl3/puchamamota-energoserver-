import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Button.module.css';

const ElementoEj: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Animación inicial
    gsap.from(button, {
      duration: 0.8,
      scale: 0.8,
      opacity: 0,
      ease: "back.out(1.7)"
    });

    // Animaciones de hover y click
    const hoverAnimation = () => {
      gsap.to(button, {
        duration: 0.3,
        scale: 1.05,
        backgroundColor: "#4a90e2",
        boxShadow: "0 4px 15px rgba(74, 144, 226, 0.4)",
        ease: "power2.out"
      });
    };

    const hoverOutAnimation = () => {
      gsap.to(button, {
        duration: 0.3,
        scale: 1,
        backgroundColor: "#2d3436",
        boxShadow: "none",
        ease: "power2.out"
      });
    };

    const clickAnimation = () => {
      gsap.to(button, {
        duration: 0.1,
        scale: 0.95,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(button, {
            duration: 0.2,
            scale: 1,
            ease: "elastic.out(1, 0.5)"
          });
        }
      });
    };

    button.addEventListener('mouseenter', hoverAnimation);
    button.addEventListener('mouseleave', hoverOutAnimation);
    button.addEventListener('click', clickAnimation);

    return () => {
      button.removeEventListener('mouseenter', hoverAnimation);
      button.removeEventListener('mouseleave', hoverOutAnimation);
      button.removeEventListener('click', clickAnimation);
    };
  }, []);

  return (
    <button 
      ref={buttonRef}
      className={styles.primary}
      type="button"
    >
      Click
    </button>
  );
};

export default ElementoEj;