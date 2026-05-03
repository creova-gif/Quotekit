import { toast } from 'sonner';

export default function LeadForms() {
  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-[26px]">
      <div className="flex items-center justify-between mb-5">
        <div className="text-[23px] tracking-[-0.4px]" style={{ fontFamily: 'var(--qk-serif)' }}>Lead forms</div>
        <button className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-all" onClick={() => toast.success('New form created')}>
          + New form
        </button>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-4">
        {/* Form Builder */}
        <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] p-[18px]">
          <div className="text-[15px] font-medium mb-4">Contact form</div>
          {['Full name', 'Email address', 'Company name', 'Project type', 'Estimated budget', 'Timeline', 'Project description'].map((field, i) => (
            <div key={i} className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[10px] px-[13px] py-[11px] mb-2 cursor-pointer hover:border-[--qk-bdr2] transition-all relative">
              <div className="text-[11.5px] font-medium text-[--qk-ink2] mb-1">{field}</div>
              <input className="w-full px-[9px] py-[7px] border border-[--qk-bdr] rounded-md text-[13px] bg-[--qk-s0] text-[--qk-ink3]" placeholder={`Enter ${field.toLowerCase()}...`} style={{ fontFamily: 'var(--qk-sans)' }} />
              <div className="absolute top-[10px] right-[10px] text-[--qk-ink4] cursor-grab flex items-center gap-[3px]">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="5" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
            </div>
          ))}
          <button className="w-full px-3 py-[6px] rounded-[10px] border border-dashed border-[--qk-bdr] bg-transparent text-[--qk-ink3] text-[13px] hover:bg-[--qk-s1] hover:text-[--qk-ink] transition-all" onClick={() => toast.info('Add field')}>
            + Add field
          </button>
        </div>

        {/* Field Properties */}
        <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] p-[14px]">
          <div className="text-[13px] font-medium mb-[11px]">Field settings</div>
          <div className="mb-[10px]">
            <div className="text-[11.5px] text-[--qk-ink2] mb-1">Field label</div>
            <input className="w-full px-[9px] py-[6px] border border-[--qk-bdr] rounded-[10px] text-[13.5px] text-[--qk-ink] bg-[--qk-s1] outline-none focus:border-[--qk-blue-m] focus:bg-[--qk-s0] transition-all" defaultValue="Full name" style={{ fontFamily: 'var(--qk-sans)' }} />
          </div>
          <div className="mb-[10px]">
            <div className="text-[11.5px] text-[--qk-ink2] mb-1">Field type</div>
            <select className="w-full px-[9px] py-[6px] border border-[--qk-bdr] rounded-[10px] text-[13.5px] text-[--qk-ink] bg-[--qk-s1] outline-none" style={{ fontFamily: 'var(--qk-sans)' }}>
              <option>Text</option>
              <option>Email</option>
              <option>Number</option>
              <option>Select</option>
              <option>Textarea</option>
            </select>
          </div>
          <div className="flex items-center justify-between mb-[10px]">
            <div className="text-[11.5px] text-[--qk-ink2]">Required field</div>
            <div className="w-[31px] h-[17px] rounded-[9px] bg-[--qk-blue] cursor-pointer relative">
              <div className="absolute w-[13px] h-[13px] bg-white rounded-full top-[2px] left-[16px] shadow-sm"></div>
            </div>
          </div>
          <div className="border-t border-[--qk-bdr] pt-[10px] mt-[10px]">
            <div className="text-[12px] font-medium mb-2">Form stats</div>
            <div className="text-[11.5px] text-[--qk-ink3] mb-1">143 submissions</div>
            <div className="text-[11.5px] text-[--qk-ink3]">38% conversion</div>
          </div>
          <button className="w-full mt-3 px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-all" onClick={() => toast.success('Embed code copied')}>
            Get embed code
          </button>
        </div>
      </div>
    </div>
  );
}
