import { onUnmounted } from 'vue'

function useCreateNode (nodeName: string) {
  const node = document.createElement('div')
  node.id = nodeName
  document.body.appendChild(node)
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}

export default useCreateNode
