type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  tone?: "default" | "onBrand";
};

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};

const toneMap = {
  default: "border-border border-t-brand",
  onBrand: "border-white/30 border-t-white",
};

const Spinner = ({ size = "md", className = "", tone = "default" }: SpinnerProps) => {
  return (
    <span
      className={`inline-block animate-spin rounded-full ${toneMap[tone]} ${sizeMap[size]} ${className}`}
      aria-hidden="true"
    />
  );
};

export default Spinner;
