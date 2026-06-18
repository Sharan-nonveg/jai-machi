export const isMobile = () =>
  typeof window !== 'undefined' &&
  (/iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768)
