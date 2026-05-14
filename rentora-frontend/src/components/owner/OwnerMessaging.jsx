import { useState, useEffect, useRef } from 'react'
import API from '../../services/axiosConfig'
import { Send, Home, ChevronLeft,
         MessageSquare } from 'lucide-react'

const OwnerMessaging = ({ profile }) => {
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (activeConv) fetchThread(activeConv)
  }, [activeConv])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      { behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await API.get(
        '/messages/owner-conversations')
      setConversations(res.data)
    } catch (err) { console.error(err) }
  }

  const fetchThread = async (conv) => {
    try {
      const res = await API.get(
        `/messages/conversation?propertyId=${conv.propertyId}&tenantId=${conv.tenantId}`)
      setMessages(res.data)
    } catch (err) { console.error(err) }
  }

  const handleReply = async () => {
    if (!newMessage.trim() || !activeConv) return
    setSending(true)
    try {
      await API.post('/messages/reply', {
        tenantId: activeConv.tenantId,
        propertyId: activeConv.propertyId,
        content: newMessage
      })
      setNewMessage('')
      fetchThread(activeConv)
      fetchConversations()
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={`grid gap-4 h-[600px] ${activeConv ? 'grid-cols-[280px_1fr]' : 'grid-cols-1'}`}>

      {/* Conversations list */}
      <div className="bg-white border border-rentora-border rounded-[18px] overflow-hidden flex flex-col">
        <div className="p-4 px-5 border-b border-rentora-border font-bold text-[15px] text-rentora-ink flex items-center gap-2">
          <MessageSquare size={16} className="text-rentora-green"/>
          Tenant Inquiries
        </div>

        <div className="overflow-y-auto flex-1">
          {conversations.length === 0 ? (
            <div className="p-10 px-5 text-center text-rentora-ink-muted text-[13px]">
              <MessageSquare size={32} className="text-rentora-green/20 mx-auto mb-2"/>
              <p>No inquiries yet</p>
            </div>
          ) : (
            conversations.map((conv, i) => (
              <div
                key={i}
                onClick={() => setActiveConv(conv)}
                className={`p-3.5 px-5 cursor-pointer transition-colors border-b border-rentora-border/50 ${
                  activeConv?.tenantId === conv.tenantId && activeConv?.propertyId === conv.propertyId
                    ? 'bg-rentora-green-tint'
                    : 'bg-transparent hover:bg-rentora-green-pale'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-rentora-green-tint rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-[14px] text-rentora-green">
                    {conv.tenantName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[13px] font-semibold text-rentora-ink truncate">
                      {conv.tenantName}
                    </p>
                    <p className="text-[11px] text-rentora-ink-muted truncate">
                      {conv.senderRole === 'TENANT' ? `${conv.tenantName}: ` : 'You: '}
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat thread */}
      {activeConv && (
        <div className="bg-white border border-rentora-border rounded-[18px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-3.5 px-5 border-b border-rentora-border flex items-center gap-3">
            <button
              onClick={() => setActiveConv(null)}
              className="bg-transparent border-none cursor-pointer p-1 text-rentora-ink-muted flex items-center"
            >
              <ChevronLeft size={18}/>
            </button>
            <div className="w-9 h-9 bg-rentora-green-tint rounded-xl flex items-center justify-center font-bold text-rentora-green">
              {activeConv.tenantName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-rentora-ink">
                {activeConv.tenantName}
              </p>
              <p className="text-[11px] text-rentora-ink-muted flex items-center gap-1">
                <Home size={10}/>
                {activeConv.propertyTitle}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 bg-[#FAFAF8]">
            {messages.map((msg, i) => {
              const isMe = msg.senderRole === 'OWNER'
              return (
                <div key={i} className={`flex gap-2 items-end ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className="w-7 h-7 bg-rentora-green-tint rounded-lg flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-rentora-green">
                      {msg.tenant?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className={`p-2.5 px-3.5 text-[14px] leading-relaxed max-w-[320px] shadow-sm border ${
                      isMe 
                        ? 'bg-rentora-green text-white rounded-[16px_16px_4px_16px] border-none' 
                        : 'bg-white text-rentora-ink rounded-[16px_16px_16px_4px] border-rentora-border/10'
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[10px] text-rentora-ink-muted mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {isMe && (
                    <div className="w-7 h-7 bg-rentora-green rounded-lg flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white">
                      {profile?.name?.charAt(0).toUpperCase() || 'O'}
                    </div>
                  )}
                </div>
              )
            })}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input */}
          <div className="p-3.5 px-5 border-t border-rentora-border flex gap-2.5 items-center">
            <div className="flex-1 flex items-center bg-rentora-green-pale border-[1.5px] border-rentora-border/20 rounded-xl p-2.5 px-4 gap-2">
              <input
                className="flex-1 border-none outline-none bg-transparent text-[14px] text-rentora-ink font-poppins"
                placeholder="Type a reply..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !sending && handleReply()}
              />
            </div>
            <button
              onClick={handleReply}
              disabled={sending || !newMessage.trim()}
              className={`w-[42px] h-[42px] border-none rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                sending || !newMessage.trim() 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-rentora-green cursor-pointer'
              }`}
            >
              <Send size={16} className="text-white"/>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnerMessaging