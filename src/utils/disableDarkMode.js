export const disableDarkMode = () => {
  document.documentElement.classList.remove('dark')
  document.documentElement.style.colorScheme = 'light'
  
  const meta = document.createElement('meta')
  meta.name = 'color-scheme'
  meta.content = 'light only'
  document.head.appendChild(meta)
}