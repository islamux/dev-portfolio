'use client';
import Button from "./Button";
import { useTheme } from "next-themes";
import { Icon } from "./Icon";
import { useMounted } from "@/hooks/useMounted";

export function ThemeToggle() {

  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch - standard Next.js pattern for client-only state
  const mounted = useMounted();


  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
    >
      {mounted ? (
        theme === "dark" ? (
          <Icon name="sun" size={20} />
        ) : (
          <Icon name="moon" size={20} />
        )
      ) : (
        <Icon name="moon" size={20} />
      )}
    </Button>


  );
}
