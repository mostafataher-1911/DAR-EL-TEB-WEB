// تأكد من إزالة أي dark mode
export const disableDarkMode = () => {
  // إزالة dark class إذا كان موجود
  document.documentElement.classList.remove('dark')
  document.documentElement.style.colorScheme = 'light'
  
  // منع المتصفح من تطبيق dark mode
  const meta = document.createElement('meta')
  meta.name = 'color-scheme'
  meta.content = 'light only'
  document.head.appendChild(meta)
}