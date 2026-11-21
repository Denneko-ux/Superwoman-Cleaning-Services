import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'Superwoman Cleaning Services',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#ECEAE2] via-[#F2F1EC] to-[#E2E6E1] text-[#14211D] p-6 text-center ${className}`}
      >
        <div className="w-10 h-10 rounded-full border border-[#115E46]/20 bg-white/80 flex items-center justify-center mb-3">
          <Sparkles className="w-4 h-4 text-[#115E46]" aria-hidden="true" />
        </div>
        <p className="font-display text-base font-medium text-[#14211D]">{fallbackTitle}</p>
        <p className="text-xs text-[#4E5D57] mt-1 max-w-[24ch]">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
