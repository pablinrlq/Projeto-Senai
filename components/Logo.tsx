import Image from "next/image";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={className}>
      <Image
        src="/logo-senai.png"
        alt="SENAI Gestão"
        width={140}
        height={36}
        className="object-contain"
      />
    </div>
  );
};
