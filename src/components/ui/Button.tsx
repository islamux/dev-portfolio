
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}


export default function Button(
  {
    variant = "primary",
    size = "md",
    children,
    className = "",
    ...props
  }: ButtonProps
) {

  // Base styles for all buttons
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  // variant Style
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-500 dark:bg-brand-600 dark:hover:bg-brand-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
  };
  // size style.
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button className={
      `
      ${baseStyles}
      ${variants[variant]}
      ${sizes[size]}
      ${className}
      `
    } {...props}
    >
      {children}
    </button>
  )
}
