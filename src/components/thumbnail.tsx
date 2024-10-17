import Image from 'next/image';
import { useState } from 'react';

interface ThumbnailProps<T> {
  src: { main: string; sub: string; alt: string };
  setPriority?: boolean;
  category: T;
}

export default function Thumbnail<T>({ category, src, setPriority }: ThumbnailProps<T>) {
  const [error, setError] = useState(false);
  const handleImageError = () => {
    setError(true);
  };
  const { main, sub, alt } = src;
  return (
    <Image
      src={!error ? main : sub}
      alt={alt}
      width={640}
      height={category === 'filmShort' ? 360 : 480}
      onError={handleImageError}
      className="w-full object-cover aspect-video"
      priority={setPriority}
    />
  );
}
