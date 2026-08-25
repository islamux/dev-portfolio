import { iconPaths, type IconName } from "./icons";

export type { IconName };

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className = "" }: IconProps) {
  const paths = iconPaths[name];
  const pathArray: readonly string[] = Array.isArray(paths) ? paths : [paths];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {pathArray.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
}
