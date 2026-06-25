import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className, placeholder = null, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} {...props}>
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          {placeholder}
        </div>
      )}
      {!isLoaded && !placeholder && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
