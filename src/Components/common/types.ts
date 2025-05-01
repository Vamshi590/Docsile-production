// Centralized NavItemProps type for Docsile
export interface NavItemProps {
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
  label: string;
  path: string;
  isActive: boolean;
}
