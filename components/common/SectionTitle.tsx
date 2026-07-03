interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  centered = false,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 mt-2 text-base md:text-lg">{subtitle}</p>
      )}
    </div>
  );
}
