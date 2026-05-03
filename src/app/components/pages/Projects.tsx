import { toast } from 'sonner';

export default function Projects() {
  const projects = [
    { name: 'Volta Goods — Brand & Web', progress: 65, tasks: [
      { name: 'Brand discovery workshop', done: true },
      { name: 'Logo concepts (round 1)', done: true },
      { name: 'Brand guidelines document', done: false },
      { name: 'Shopify theme setup', done: false },
    ]},
    { name: 'Opal Events — Website redesign', progress: 42, tasks: [
      { name: 'Wireframes approved', done: true },
      { name: 'Design system creation', done: false },
      { name: 'Homepage mockup', done: false },
    ]},
    { name: 'Meridian — Content strategy', progress: 88, tasks: [
      { name: 'Content audit', done: true },
      { name: 'SEO keyword research', done: true },
      { name: 'Blog post calendar', done: true },
      { name: 'Final deliverables', done: false },
    ]},
  ];

  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-[26px]">
      <div className="flex items-center justify-between mb-5">
        <div className="text-[23px] tracking-[-0.4px]" style={{ fontFamily: 'var(--qk-serif)' }}>Projects</div>
        <button className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-all" onClick={() => toast.success('New project created')}>
          + New project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project, i) => (
          <div key={i} className="border border-[--qk-bdr] rounded-[14px] overflow-hidden">
            <div className="px-[15px] py-[11px] border-b border-[--qk-bdr] flex items-center justify-between">
              <div className="text-[13.5px] font-medium">{project.name}</div>
              <div className="text-[12px] text-[--qk-ink3]">{project.progress}%</div>
            </div>
            <div className="h-[5px] bg-[--qk-s1] overflow-hidden">
              <div className="h-full bg-[--qk-blue] rounded-[3px]" style={{ width: `${project.progress}%` }}></div>
            </div>
            {project.tasks.map((task, j) => (
              <div key={j} className="flex items-center gap-2 px-[15px] py-2 border-b border-[--qk-bdr] last:border-0 text-[13px]">
                <div className={`w-[15px] h-[15px] rounded border-[1.5px] cursor-pointer flex items-center justify-center transition-all flex-shrink-0 ${
                  task.done ? 'bg-[--qk-grn] border-[--qk-grn]' : 'border-[--qk-bdr2]'
                }`} onClick={() => toast.success('Task toggled')}>
                  {task.done && (
                    <svg className="w-2 h-2" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <div className={`flex-1 ${task.done ? 'line-through text-[--qk-ink3]' : ''}`}>{task.name}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
