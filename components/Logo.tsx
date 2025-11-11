export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`font-bold text-2xl ${className}`}>
      <span className="text-primary">SENAI</span>
      <span className="text-secondary ml-1">Gestão</span>
    </div>
  );
};
