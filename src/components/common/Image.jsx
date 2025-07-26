import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Optional, if using their default blur

const Image = ({ alt, height, src, width, className, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleLoad = () => {
    setIsLoading(false);
  };


  return (
    <div className="relative h-full">
      {isLoading && (
        <div className="h-full inset-0 z-50 flex items-center justify-center bg-white">
          <div className="relative flex flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border border-gray-200 border-t-[#caa446]"></div>
          </div>
        </div>
      )}
      <LazyLoadImage
        alt={alt}
        height={height}
        src={src}
        width={width}
        onClick={onClick}
        beforeLoad={handleLoad}
        afterLoad={() => setIsLoaded(true)}
        className={`${className} transition-all duration-700 ease-in-out ${
          isLoaded ? 'blur-0' : 'blur-[1px]'
        }`}
      />
    </div>
  );
};

export default Image;