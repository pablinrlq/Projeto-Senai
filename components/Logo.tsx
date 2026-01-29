type LogoProps = {
  className?: string;
  imgClassName?: string;
};

export const Logo = ({
  className = "",
  imgClassName = "h-9 w-auto object-contain mix-blend-multiply",
}: LogoProps) => {
  return (
    <div className={className}>
      <img
        src="/branding/logo.png"
        alt="SENAI Gestão"
        className={imgClassName}
        loading="lazy"
      />
    </div>
  );
};
