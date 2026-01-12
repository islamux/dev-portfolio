interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
}

export default function Container({
  children,
  className = "",
  as: Component = "div",
}: ContainerProps) {

  return (
    <Component className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Component>
  );
}


