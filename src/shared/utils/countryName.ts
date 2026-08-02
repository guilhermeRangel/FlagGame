export function normalizeCountryName(countryName: string): string {
  return countryName.trim().normalize('NFKC').toLocaleLowerCase('pt-BR');
}
