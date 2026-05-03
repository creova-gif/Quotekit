import { useState } from 'react';
import { toast } from 'sonner';

export default function NexusAI() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: "Hi Sofia! I'm Nexus AI, your proposal assistant powered by Claude. I have access to all your proposals, client data, and win rates. What would you like to know?",
      time: '11:42 AM'
    },
    {
      type: 'user',
      text: "Draft a proposal for Marcus Chen at Volta Goods - brand identity and Shopify store, around $10k budget",
      time: '11:43 AM'
    },
    {
      type: 'ai',
      text: "I've analyzed your past proposals for similar projects. Based on your 78% win rate on e-commerce branding projects, here's what I recommend:\n\n**Scope**: Complete brand identity + Shopify storefront\n**Pricing**: $9,850 (optimal based on your pricing history)\n**Timeline**: 8-10 weeks\n**Add-ons**: ROI calculator (increases acceptance by 34%)\n\nShall I generate the full proposal now?",
      time: '11:43 AM'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-sonnet');

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, {
      type: 'user',
      text: message,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }]);
    setMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'ai',
        text: "I'm analyzing that request. Based on your data, here's my recommendation...",
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="flex-1 grid grid-cols-[1fr_320px] overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-qk-s0 border-b border-qk-bdr px-6 py-[14px] flex items-center gap-[14px] flex-shrink-0">
          <div className="w-9 h-9 bg-qk-pur rounded-[10px] flex items-center justify-center flex-shrink-0">
            <svg className="w-[17px] h-[17px]" stroke="#fff" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-medium">Nexus AI</div>
            <div className="text-[12px] text-qk-ink3 mt-[1px]">Powered by Claude + RAG pipeline</div>
          </div>
          <div className="flex items-center gap-[5px] px-[10px] py-[5px] bg-qk-pur-l border border-qk-pur-m rounded-full text-[12px] text-qk-pur ml-auto">
            <div className="w-[6px] h-[6px] rounded-full bg-qk-pur animate-pulse"></div>
            Claude Sonnet 4
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 max-w-full ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11.5px] font-medium flex-shrink-0 mt-[2px] ${
                msg.type === 'ai' ? 'bg-qk-pur text-white' : 'bg-qk-blue-l text-qk-blue'
              }`}>
                {msg.type === 'ai' ? '✦' : 'SA'}
              </div>
              <div>
                <div className={`bg-qk-s0 border border-qk-bdr rounded-[14px] px-4 py-3 max-w-[680px] leading-[1.65] text-[14px] ${
                  msg.type === 'user' ? 'bg-qk-blue border-qk-blue text-white rounded-tr-[4px]' : 'rounded-tl-[4px]'
                }`}>
                  {msg.text.split('\n').map((line, j) => (
                    <p key={j} className="mb-2 last:mb-0">{line}</p>
                  ))}
                </div>
                <div className={`text-[10.5px] text-qk-ink3 mt-[5px] px-1 ${msg.type === 'user' ? 'text-right' : ''}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-[30px] h-[30px] rounded-full bg-qk-pur text-white flex items-center justify-center text-[11.5px] font-medium flex-shrink-0 mt-[2px]">✦</div>
              <div className="flex items-center gap-[5px] px-[14px] py-[10px] bg-qk-s0 border border-qk-bdr rounded-tl-[4px] rounded-[14px]">
                <div className="w-[7px] h-[7px] rounded-full bg-qk-ink3 animate-bounce"></div>
                <div className="w-[7px] h-[7px] rounded-full bg-qk-ink3 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-[7px] h-[7px] rounded-full bg-qk-ink3 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-qk-s0 border-t border-qk-bdr px-5 py-[14px] flex-shrink-0">
          <div className="flex gap-[6px] mb-[10px] flex-wrap">
            {['Draft a proposal', 'Analyze win rate', 'Suggest pricing', 'Compare proposals'].map((shortcut, i) => (
              <button
                key={i}
                onClick={() => setMessage(shortcut)}
                className="px-[11px] py-[5px] bg-qk-s1 border border-qk-bdr rounded-full text-[12px] text-qk-ink2 hover:bg-qk-pur-l hover:border-qk-pur-m hover:text-qk-pur transition-all flex items-center gap-[5px]"
              >
                <svg className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                {shortcut}
              </button>
            ))}
          </div>

          <div className="flex gap-[10px] items-end">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 px-[14px] py-[10px] border border-qk-bdr rounded-xl text-[14px] resize-none min-h-[44px] max-h-[140px] outline-none transition-all bg-qk-s1 focus:border-qk-pur-m focus:bg-qk-s0 placeholder:text-qk-ink3"
              style={{ fontFamily: 'var(--qk-sans)' }}
              placeholder="Ask Nexus anything about proposals, pricing, clients..."
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="w-10 h-10 bg-qk-pur border-none rounded-[10px] flex items-center justify-center transition-all hover:bg-[#6d28d9] disabled:bg-qk-s2 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg className={`w-4 h-4 ${message.trim() ? 'stroke-white' : 'stroke-qk-ink3'}`} fill="none" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="border-l border-qk-bdr bg-qk-s0 overflow-y-auto flex flex-col">
        {/* Data Sources */}
        <div className="px-4 py-[14px] border-b border-qk-bdr">
          <div className="text-[11px] font-medium tracking-[0.8px] uppercase text-qk-ink3 mb-[10px]">Data Sources</div>
          {[
            { name: 'Proposals', icon: '📄', status: 'live', count: '24' },
            { name: 'Clients', icon: '👥', status: 'live', count: '6' },
            { name: 'Analytics', icon: '📊', status: 'live', count: 'All' },
          ].map((source, i) => (
            <div key={i} className="flex items-center gap-[10px] px-[10px] py-2 border border-qk-grn-m bg-qk-grn-l rounded-[10px] mb-[6px] last:mb-0 cursor-pointer hover:border-qk-grn transition-all">
              <div className="w-7 h-7 rounded-[7px] bg-white flex items-center justify-center flex-shrink-0 text-[12px] font-semibold">{source.icon}</div>
              <div className="flex-1">
                <div className="text-[12.5px] font-medium">{source.name}</div>
              </div>
              <div className="text-[11px] text-qk-grn">{source.status}</div>
            </div>
          ))}
        </div>

        {/* Model Selection */}
        <div className="px-4 py-[14px] border-b border-qk-bdr">
          <div className="text-[11px] font-medium tracking-[0.8px] uppercase text-qk-ink3 mb-[10px]">Model</div>
          {[
            { id: 'claude-sonnet', name: 'Claude Sonnet 4', desc: 'Best balance' },
            { id: 'claude-opus', name: 'Claude Opus 4', desc: 'Most capable' },
            { id: 'claude-haiku', name: 'Claude Haiku 4', desc: 'Fastest' },
          ].map((model) => (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`flex items-center justify-between px-[10px] py-2 border rounded-[10px] mb-[6px] last:mb-0 cursor-pointer transition-all ${
                selectedModel === model.id
                  ? 'border-qk-pur-m bg-qk-pur-l'
                  : 'border-qk-bdr hover:bg-qk-s1'
              }`}
            >
              <div>
                <div className="text-[12.5px] font-medium">{model.name}</div>
                <div className="text-[11px] text-qk-ink3">{model.desc}</div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedModel === model.id ? 'bg-qk-pur border-qk-pur' : 'border-qk-bdr'
              }`}>
                {selectedModel === model.id && (
                  <svg className="w-2 h-2" stroke="#fff" strokeWidth="3" fill="none" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* RAG Pipeline */}
        <div className="px-4 py-[14px] border-b border-qk-bdr">
          <div className="text-[11px] font-medium tracking-[0.8px] uppercase text-qk-ink3 mb-[10px]">RAG Pipeline</div>
          <div className="bg-qk-ink rounded-xl px-[14px] py-[14px] overflow-hidden">
            {[
              { title: 'Query', desc: 'Semantic search', color: '#1d4ed8', icon: 'search' },
              { title: 'Retrieve', desc: 'Top 5 matches', color: '#7c3aed', icon: 'database' },
              { title: 'Augment', desc: 'Context injection', color: '#0d9488', icon: 'layers' },
              { title: 'Generate', desc: 'Claude response', color: '#16a34a', icon: 'sparkles' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-[10px] mb-[10px] last:mb-0">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: step.color }}>
                    <svg className="w-[10px] h-[10px]" stroke="#fff" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  {i < 3 && <div className="w-[1px] flex-1 min-h-[10px] bg-white/10 mt-[3px]"></div>}
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-white/90 mb-[1px]">{step.title}</div>
                  <div className="text-[11px] text-white/40 leading-[1.4]">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-[14px]">
          <div className="text-[11px] font-medium tracking-[0.8px] uppercase text-qk-ink3 mb-[10px]">Quick Actions</div>
          {[
            { title: 'Generate proposal', sub: 'From client data', color: 'bg-qk-blue-l', icon: '✨' },
            { title: 'Analyze pricing', sub: 'Compare win rates', color: 'bg-qk-grn-l', icon: '💰' },
            { title: 'Research client', sub: 'Background info', color: 'bg-qk-pur-l', icon: '🔍' },
          ].map((action, i) => (
            <div
              key={i}
              onClick={() => toast.info(`${action.title}...`)}
              className="flex items-start gap-[10px] px-3 py-[10px] border border-qk-bdr rounded-[10px] mb-[6px] last:mb-0 cursor-pointer hover:border-qk-pur-m hover:bg-qk-pur-l transition-all"
            >
              <div className={`w-7 h-7 rounded-[7px] ${action.color} flex items-center justify-center flex-shrink-0 text-[13px]`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <div className="text-[12.5px] font-medium mb-[1px]">{action.title}</div>
                <div className="text-[11.5px] text-qk-ink3">{action.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage */}
        <div className="px-4 py-[14px] border-t border-qk-bdr mt-auto">
          <div className="text-[11px] font-medium tracking-[0.8px] uppercase text-qk-ink3 mb-[10px]">Usage This Month</div>
          <div className="h-[5px] bg-qk-s2 rounded-[3px] overflow-hidden mb-1">
            <div className="h-full bg-qk-blue rounded-[3px]" style={{ width: '42%' }}></div>
          </div>
          <div className="text-[11px] text-qk-ink3">4,200 / 10,000 queries</div>
        </div>
      </div>
    </div>
  );
}
