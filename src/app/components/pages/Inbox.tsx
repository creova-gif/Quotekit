import { toast } from 'sonner';

export default function Inbox() {
  const messages = [
    { name: 'Marcus Chen', preview: 'Just opened the proposal — looks great! Quick question about the timeline...', time: '2m ago', unread: true, avatar: 'MC', color: '#dbeafe', textColor: '#1d4ed8' },
    { name: 'Priya Sharma', preview: 'Can we schedule a call to discuss the brand strategy section?', time: '1h ago', unread: true, avatar: 'PS', color: '#fce7f3', textColor: '#831843' },
    { name: 'Emma Torres', preview: 'Thank you for the proposal. We\'d like to move forward with the recommended package.', time: '3h ago', unread: true, avatar: 'ET', color: '#f5f3ff', textColor: '#7c3aed' },
    { name: 'James Okafor', preview: 'Signed the proposal! Looking forward to working together.', time: '1 day ago', unread: false, avatar: 'JO', color: '#d1fae5', textColor: '#065f46' },
    { name: 'David Kim', preview: 'Could you send over a couple case studies in the fintech space?', time: '2 days ago', unread: false, avatar: 'DK', color: '#fffbeb', textColor: '#b45309' },
  ];

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="px-[30px] py-[26px] border-b border-[--qk-bdr]">
        <div className="text-[23px] tracking-[-0.4px]" style={{ fontFamily: 'var(--qk-serif)' }}>Inbox</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`relative flex gap-[11px] px-[17px] py-3 border-b border-[--qk-bdr] cursor-pointer transition-colors hover:bg-[--qk-s1] ${
              msg.unread ? 'bg-[--qk-blue-l]' : ''
            }`}
            onClick={() => toast.info(`Opening message from ${msg.name}`)}
          >
            {msg.unread && (
              <div className="absolute left-[5px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[--qk-blue]"></div>
            )}
            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0" style={{ background: msg.color, color: msg.textColor }}>
              {msg.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-medium mb-[1px]">{msg.name}</div>
              <div className="text-[12.5px] text-[--qk-ink3] whitespace-nowrap overflow-hidden text-ellipsis">{msg.preview}</div>
            </div>
            <div className="text-[11.5px] text-[--qk-ink3] whitespace-nowrap flex-shrink-0 ml-auto">{msg.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
