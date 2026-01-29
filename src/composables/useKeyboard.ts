import { onMounted, onUnmounted } from 'vue'

export function useKeyboard(handlers: Record<string, () => void>) {
  const handleKeydown = (event: KeyboardEvent) => {
    const handler = handlers[event.key]
    if (handler) {
      event.preventDefault()
      handler()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
