import AlertMessage from '@/components/AlertMessage.vue'
import { createApp } from 'vue'

export type MessageType = 'success' | 'error' | 'default'
const createMessage = (message: string, type: MessageType, timeout: number) => {
  const messageInstance = createApp(AlertMessage, {
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount(mountNode)
    document.body.removeChild(mountNode)
  }, timeout)
}
export default createMessage
