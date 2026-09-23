import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  size?: number;
};

export function BrandMark({ className, size = 28 }: BrandMarkProps) {
  return (
    <Image
      src="/logo.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
