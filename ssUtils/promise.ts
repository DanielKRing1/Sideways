export function timeout(ms: number) {
  return new Promise((resolve: any) => setTimeout(resolve, ms));
}
