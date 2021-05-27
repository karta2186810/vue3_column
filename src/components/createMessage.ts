/* 使用函數方式創建組件，利用了vue的createApp方法 */
// createApp方法可以創建一個應用
import { createApp } from 'vue'
// 將定義好的Message組件引入
import Message from './Message.vue'
export type MeassageType = 'success' | 'error' | 'default'
// 定義創建組件的方法
const createMessage = (message: string, type: MeassageType, timeout = 2000) => {
  // 使用createApp創建組件，接收兩個參數
  // 第一個參數: 要創建的組件
  // 第二個參數: 該組件會接收的props
  const messageInstance = createApp(Message, {
    message,
    type
  })
  // 創建應用要掛載的節點
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  // 將經由createApp創建的應用掛載到節點上
  messageInstance.mount(mountNode)
  // 設置定時器，時間到將應用從節點上卸載，並刪除該節點
  setTimeout(() => {
    messageInstance.unmount()
    document.body.removeChild(mountNode)
  }, timeout)
}

export default createMessage
