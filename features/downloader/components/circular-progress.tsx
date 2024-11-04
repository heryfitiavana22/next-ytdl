export function CircularProgress({ value }: CircularProgressProps) {
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-16 h-16">
        <circle
          className="text-muted-foreground"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="20"
          cx="32"
          cy="32"
        />
        <circle
          className="text-primary"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="20"
          cx="32"
          cy="32"
        />
      </svg>
      <span className="absolute text-xs">{value}%</span>
    </div>
  );
}

type CircularProgressProps = {
  value: number;
};
