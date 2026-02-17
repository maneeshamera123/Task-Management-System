export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getCopyrightText(companyName: string): string {
  const year = getCurrentYear();
  return `© ${year} ${companyName}. All rights reserved.`;
}
