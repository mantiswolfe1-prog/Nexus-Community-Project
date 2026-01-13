// Utility functions for Nexus

export function createPageUrl(page) {
  return `/${page.toLowerCase()}`;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}