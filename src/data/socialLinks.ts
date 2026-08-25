import type { IconName } from "@/components/ui/icons";

/**
 * Social media links displayed in site footer
 * Update this array to add/remove social links
 */
export interface SocialLink {
  name: string;
  href: string;
  icon: IconName;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/islamux',
    icon: 'github',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/islamux',
    icon: 'twitter',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/fathi-alqadasi-7893471b/',
    icon: 'linkedin',
  },
  {
    name: 'GitLab',
    href: 'https://gitlab.com/islamux',
    icon: 'gitlab',
  },
];
