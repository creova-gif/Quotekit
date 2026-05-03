export default function Analytics() {
  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-[26px]">
      <div className="text-[23px] tracking-[-0.4px] mb-5" style={{ fontFamily: 'var(--qk-serif)' }}>Analytics</div>

      <div className="grid grid-cols-2 gap-[15px] mb-4">
        <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] p-[17px]">
          <div className="text-[13.5px] font-medium mb-[2px]">Proposal funnel</div>
          <div className="text-[12px] text-[--qk-ink3] mb-[13px]">Conversion by stage</div>
          {[
            { label: 'Created', value: 84, count: 84 },
            { label: 'Sent', value: 72, count: 72 },
            { label: 'Opened', value: 56, count: 56 },
            { label: 'Accepted', value: 24, count: 24 },
          ].map((stage, i) => {
            const colors = ['var(--qk-blue)', 'var(--qk-pur)', 'var(--qk-grn)', 'var(--qk-tel)'];
            return (
              <div key={i} className="flex items-center gap-[9px] mb-[6px] last:mb-0">
                <div className="text-[12px] w-[72px] text-[--qk-ink2]">{stage.label}</div>
                <div className="flex-1 h-5 bg-[--qk-s1] rounded-[3px] overflow-hidden">
                  <div className="h-full rounded-[3px] flex items-center px-[7px] text-[11px] font-medium text-white" style={{ width: `${stage.value}%`, background: colors[i] }}>
                    {stage.value}%
                  </div>
                </div>
                <div className="text-[12px] w-[26px] text-right" style={{ fontFamily: 'var(--qk-mono)' }}>{stage.count}</div>
              </div>
            );
          })}
        </div>

        <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] p-[17px]">
          <div className="text-[13.5px] font-medium mb-[2px]">Performance</div>
          <div className="text-[12px] text-[--qk-ink3] mb-[13px]">Key metrics</div>
          {[
            { label: 'Avg. time to accept', value: '3.2 days' },
            { label: 'Avg. proposal value', value: '$11,240' },
            { label: 'Win rate', value: '41%' },
            { label: 'Response rate', value: '78%' },
          ].map((metric, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-[--qk-bdr] last:border-0 text-[13px]">
              <span className="text-[--qk-ink2]">{metric.label}</span>
              <strong style={{ fontFamily: 'var(--qk-mono)' }} className="font-medium">{metric.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
