import { useState } from 'react';
import { toast } from 'sonner';

export default function Scheduler() {
  const [selectedSession, setSelectedSession] = useState(0);
  const [selectedDate, setSelectedDate] = useState(7);

  const sessionTypes = [
    { name: 'Discovery call', duration: '30 min', price: 'Free', icon: 'phone', color: 'blue' },
    { name: 'Strategy session', duration: '60 min', price: '$250', icon: 'users', color: 'purple' },
    { name: 'Project kickoff', duration: '45 min', price: 'Client only', icon: 'calendar', color: 'green' },
  ];

  const timeSlots = [
    { time: '9:00 AM', duration: '30 min · Google Meet', available: true },
    { time: '2:00 PM', duration: 'Booked — Marcus Chen', booked: true },
    { time: '3:30 PM', duration: '30 min · Google Meet', available: true },
    { time: '4:30 PM', duration: 'Opal Events — Strategy', booked: true, disabled: true },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-[26px]">
      <div className="flex items-center justify-between mb-5">
        <div className="text-[23px] tracking-[-0.4px]" style={{ fontFamily: 'var(--qk-serif)' }}>Scheduler</div>
        <div className="flex gap-2">
          <button className="px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] hover:bg-[--qk-s1] transition-all" onClick={() => toast.success('Booking link copied: quotekit.io/book/sofia')}>
            Copy booking link
          </button>
          <button className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-all" onClick={() => toast.success('New session type created')}>
            + Session type
          </button>
        </div>
      </div>

      {/* Session Types */}
      <div className="grid grid-cols-3 gap-[9px] mb-4">
        {sessionTypes.map((session, i) => {
          const colors = {
            blue: { bg: 'bg-[--qk-blue-l]', stroke: 'var(--qk-blue)' },
            purple: { bg: 'bg-[--qk-pur-l]', stroke: 'var(--qk-pur)' },
            green: { bg: 'bg-[--qk-grn-l]', stroke: 'var(--qk-grn)' },
          };
          const color = colors[session.color as keyof typeof colors];

          return (
            <div
              key={i}
              onClick={() => setSelectedSession(i)}
              className={`bg-[--qk-s0] border rounded-[14px] px-[14px] py-[13px] cursor-pointer transition-all ${
                selectedSession === i
                  ? 'border-2 border-[--qk-blue] bg-[--qk-blue-l]'
                  : 'border-[--qk-bdr] hover:border-[--qk-blue-m] hover:shadow-sm'
              }`}
            >
              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center mb-2 ${color.bg}`}>
                <svg className="w-[15px] h-[15px]" fill="none" stroke={color.stroke} strokeWidth="1.8" viewBox="0 0 24 24">
                  {session.icon === 'phone' && <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.72A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>}
                  {session.icon === 'users' && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>}
                  {session.icon === 'calendar' && <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}
                </svg>
              </div>
              <div className="text-[13px] font-medium mb-[2px]">{session.name}</div>
              <div className="text-[12px] text-[--qk-ink3]">{session.duration}</div>
              <div className="text-[13px] font-medium mt-[5px]" style={{ fontFamily: 'var(--qk-mono)', color: session.price === 'Free' || session.price === 'Client only' ? 'var(--qk-grn)' : 'inherit' }}>
                {session.price}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar and Time Slots */}
      <div className="grid grid-cols-[280px_1fr] gap-[18px]">
        <div>
          {/* Calendar */}
          <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] overflow-hidden mb-3">
            <div className="px-4 py-[14px] border-b border-[--qk-bdr] flex items-center justify-between">
              <button className="px-2 py-1 rounded-md border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] hover:bg-[--qk-s1] transition-all" onClick={() => toast.info('Previous month')}>
                ←
              </button>
              <div className="text-[14px] font-medium">April 2026</div>
              <button className="px-2 py-1 rounded-md border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] hover:bg-[--qk-s1] transition-all" onClick={() => toast.info('Next month')}>
                →
              </button>
            </div>
            <div className="px-[10px] pt-[10px]">
              <div className="grid grid-cols-7 pb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-[10.5px] text-[--qk-ink3] py-1 font-medium">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-[1px]">
                {[...Array(30)].map((_, i) => {
                  const date = i + 1;
                  const isToday = date === 7;
                  const isSelected = date === selectedDate;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`text-center px-[3px] py-[5px] rounded-md cursor-pointer text-[12.5px] transition-all m-[1px] ${
                        isSelected
                          ? 'bg-[--qk-blue] text-white'
                          : isToday
                          ? 'font-medium text-[--qk-blue] hover:bg-[--qk-blue-l]'
                          : 'hover:bg-[--qk-blue-l] hover:text-[--qk-blue]'
                      }`}
                    >
                      {date}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Intake Form */}
          <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] px-[14px] py-[13px]">
            <div className="text-[13px] font-medium mb-[9px]">Intake form</div>
            <div className="text-[12.5px] text-[--qk-ink2] mb-2">Questions asked before each discovery call:</div>
            <div className="flex flex-col gap-[5px] mb-2">
              <div className="text-[12px] text-[--qk-ink2] px-[9px] py-[6px] bg-[--qk-s1] rounded-[10px]">What type of project are you looking for help with?</div>
              <div className="text-[12px] text-[--qk-ink2] px-[9px] py-[6px] bg-[--qk-s1] rounded-[10px]">What's your estimated budget range?</div>
              <div className="text-[12px] text-[--qk-ink2] px-[9px] py-[6px] bg-[--qk-s1] rounded-[10px]">When are you looking to start?</div>
            </div>
            <button className="w-full px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] flex items-center justify-center hover:bg-[--qk-s1] transition-all" onClick={() => toast.info('Edit intake form')}>
              Edit questions
            </button>
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] overflow-hidden">
          <div className="px-4 py-[14px] border-b border-[--qk-bdr]">
            <div className="text-[14px] font-medium">April 7, 2026</div>
            <div className="text-[12px] text-[--qk-ink3] mt-[1px]">Discovery call · 30 min slots</div>
          </div>
          {timeSlots.map((slot, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-[10px] border-b border-[--qk-bdr] last:border-0 cursor-pointer transition-all ${
                slot.booked
                  ? 'bg-[--qk-blue-l] border-l-[3px] border-l-[--qk-blue]'
                  : slot.disabled
                  ? 'opacity-45 cursor-default'
                  : 'hover:bg-[--qk-blue-l]'
              }`}
              onClick={() => !slot.disabled && toast.success(slot.booked ? 'View booking details' : `Booked: ${slot.time} — confirmation sent to client`)}
            >
              <div>
                <div className={`text-[13.5px] font-medium ${slot.booked ? 'text-[--qk-blue]' : ''}`}>{slot.time}</div>
                <div className={`text-[12px] ${slot.booked ? 'text-[--qk-blue]' : 'text-[--qk-ink3]'}`}>{slot.duration}</div>
              </div>
              {slot.available ? (
                <button className="px-[11px] py-[5px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[12px] hover:bg-[--qk-blue-d] transition-all">
                  Book
                </button>
              ) : slot.booked && !slot.disabled ? (
                <span className="inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-full text-[11px] bg-[--qk-blue-l] text-[--qk-blue] before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-[--qk-blue]">
                  Confirmed
                </span>
              ) : (
                <span className="inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-full text-[11px] bg-[--qk-grn-l] text-[--qk-grn] before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-[--qk-grn]">
                  Booked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
