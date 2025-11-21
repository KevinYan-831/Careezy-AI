export interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  color: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export enum AppState {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  RESUME_BUILDER = 'RESUME_BUILDER'
}