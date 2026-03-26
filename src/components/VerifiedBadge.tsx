import verifiedImg from '/SKILLSWAP VERIFICADO.png';

interface VerifiedBadgeProps {
  className?: string;
  size?: number;
}

const VerifiedBadge = ({ className = '', size = 18 }: VerifiedBadgeProps) => {
  return (
    <img
      src={verifiedImg}
      alt="Verificado"
      width={size}
      height={size}
      className={`inline-block ${className}`}
      loading="lazy"
    />
  );
};

export default VerifiedBadge;
