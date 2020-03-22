export function px2rem (px) {
  const ratio = 372 / 10
  return px / ratio
}

export function realPx (px) { // 对于屏幕来说，真实的屏幕像素
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}
