export interface navLink {
  text: string;
  link?: string;
  children?: navLink[];
  isNavItemOpen?: 'store' | 'accounting';
}
