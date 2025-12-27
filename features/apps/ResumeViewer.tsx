
import React, { useState } from 'react';
import { Download, ZoomIn, ZoomOut, Mail, Github, Linkedin, MapPin, Globe, ExternalLink, Printer } from 'lucide-react';
import { RetroButton } from '../../components/ui/retro-ui';
import { WindowDef } from '../../types';

interface ResumeViewerProps {
    win: WindowDef;
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({ win }) => {
    const [zoom, setZoom] = useState(1);
    const RESUME_URL = 'https://ik.imagekit.io/flamefoxeswyvernp/lecogito/personal/Resume_LeThanhPhong_SE_7P6huud1M.pdf';

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    return (
        <div className="flex flex-col h-full bg-os-bg relative overflow-hidden">
            {/* Toolbar */}
            <div className="h-12 bg-os-window border-b border-os-border flex items-center justify-between px-4 shrink-0 shadow-md z-20">
                <div className="flex items-center gap-2">
                    <span className="text-os-muted text-xs font-bold font-mono tracking-wider mr-2">PDF_VIEWER_V1.0</span>
                    <div className="h-4 w-px bg-os-border mx-2 opacity-30" />
                    <button onClick={handleZoomOut} className="p-1.5 rounded hover:bg-os-bg text-os-text transition-colors" title="Zoom Out">
                        <ZoomOut size={16} />
                    </button>
                    <span className="text-xs text-os-muted w-12 text-center select-none">{Math.round(zoom * 100)}%</span>
                    <button onClick={handleZoomIn} className="p-1.5 rounded hover:bg-os-bg text-os-text transition-colors" title="Zoom In">
                        <ZoomIn size={16} />
                    </button>
                </div>
                
                <div className="flex items-center gap-2">
                    <RetroButton 
                        size="sm" 
                        variant="secondary" 
                        icon={<Printer size={14} />}
                        onClick={() => window.open(RESUME_URL, '_blank')}
                    >
                        Print
                    </RetroButton>
                    <RetroButton 
                        size="sm" 
                        variant="primary" 
                        icon={<Download size={14} />}
                        onClick={() => window.open(RESUME_URL, '_blank')}
                    >
                        Download
                    </RetroButton>
                </div>
            </div>

            {/* Scrollable Viewport */}
            <div className="flex-1 overflow-auto bg-os-bg p-8 relative flex justify-center">
                {/* Desk Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />

                {/* Paper Container */}
                <div 
                    className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-transform duration-200 ease-out origin-top"
                    style={{ 
                        width: '210mm', 
                        minHeight: '297mm', 
                        transform: `scale(${zoom})`,
                        marginBottom: '40px'
                    }}
                >
                    {/* Resume Content */}
                    <div className="p-[15mm] h-full flex flex-col font-sans text-stone-900">
                        
                        {/* Header */}
                        <header className="border-b-2 border-stone-900 pb-6 mb-6 flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Le Thanh Phong</h1>
                                <h2 className="text-lg font-bold text-os-accent font-mono uppercase tracking-widest">Full Stack Consultant</h2>
                            </div>
                            <div className="text-right text-xs font-medium text-stone-600 space-y-1">
                                <div className="flex items-center justify-end gap-2">
                                    <span>Ho Chi Minh City, VN</span>
                                    <MapPin size={12} />
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <a href="mailto:phonglethanh2@gmail.com" className="hover:text-os-accent transition-colors">phonglethanh2@gmail.com</a>
                                    <Mail size={12} />
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <a href="https://github.com/xWyvernPx" target="_blank" className="hover:text-os-accent transition-colors">github.com/xWyvernPx</a>
                                    <Github size={12} />
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <a href="https://linkedin.com/in/thanhphong2506" target="_blank" className="hover:text-os-accent transition-colors">linkedin.com/in/thanhphong2506</a>
                                    <Linkedin size={12} />
                                </div>
                            </div>
                        </header>

                        <div className="flex gap-8 flex-1">
                            {/* Left Column */}
                            <div className="w-1/3 flex flex-col gap-8">
                                <section>
                                    <h3 className="font-black uppercase tracking-widest text-sm border-b border-stone-300 pb-1 mb-3">Skills</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['React', 'TypeScript', 'Node.js', 'Java', 'Spring Boot', 'Next.js', 'Tailwind', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'Framer Motion'].map(skill => (
                                            <span key={skill} className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold uppercase border border-stone-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="font-black uppercase tracking-widest text-sm border-b border-stone-300 pb-1 mb-3">Education</h3>
                                    <div className="mb-3">
                                        <div className="font-bold text-xs">FPT University</div>
                                        <div className="text-[10px] text-stone-500 italic">2019 - 2023</div>
                                        <div className="text-[11px] mt-1">Bachelor of Software Engineering</div>
                                        <div className="text-[10px] text-os-accent font-bold mt-0.5">GPA: 3.4/4.0</div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="font-black uppercase tracking-widest text-sm border-b border-stone-300 pb-1 mb-3">Languages</h3>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span>Vietnamese</span>
                                            <span className="font-bold text-stone-400">Native</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>English</span>
                                            <span className="font-bold text-stone-400">Professional</span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Column */}
                            <div className="w-2/3 flex flex-col gap-8">
                                <section>
                                    <h3 className="font-black uppercase tracking-widest text-sm border-b border-stone-300 pb-1 mb-4">Experience</h3>
                                    
                                    {/* Job 1 */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-sm">Full Stack Consultant</h4>
                                            <span className="text-[10px] font-mono bg-stone-100 px-1">2023 - Present</span>
                                        </div>
                                        <div className="text-xs text-os-accent font-bold mb-2">Netcompany</div>
                                        <ul className="list-disc list-outside ml-3 space-y-1.5 text-[11px] text-stone-700 leading-relaxed marker:text-stone-400">
                                            <li>Orchestrated supply chain logic for the SCOT project (Roche), ensuring 99.9% uptime for critical logistics data.</li>
                                            <li>Navigated complex distributed system architectures involving Azure, Oracle SQL, and Java Spring Boot.</li>
                                            <li>Collaborated with international teams (DK, VN) to align architectural standards and delivery timelines.</li>
                                        </ul>
                                    </div>

                                    {/* Job 2 */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-sm">Software Engineer</h4>
                                            <span className="text-[10px] font-mono bg-stone-100 px-1">2021 - 2023</span>
                                        </div>
                                        <div className="text-xs text-os-accent font-bold mb-2">Hanbiro</div>
                                        <ul className="list-disc list-outside ml-3 space-y-1.5 text-[11px] text-stone-700 leading-relaxed marker:text-stone-400">
                                            <li>Engineered internal tools including "Han Spreadsheet", a web-based Excel alternative used by 500+ employees.</li>
                                            <li>Lead the migration of legacy monolith modules to a microservices architecture using Java and Redis.</li>
                                            <li>Optimized database queries reducing report generation time by 60%.</li>
                                        </ul>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="font-black uppercase tracking-widest text-sm border-b border-stone-300 pb-1 mb-4">Projects</h3>
                                    
                                    <div className="mb-4">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-sm">Pharmacy Inventory System</h4>
                                            <a href="#" className="text-[10px] text-os-accent hover:underline flex items-center gap-1">View Demo <ExternalLink size={8}/></a>
                                        </div>
                                        <p className="text-[11px] text-stone-700 leading-relaxed">
                                            A comprehensive inventory management solution for pharmacy chains. Built with React, .NET 8, and PostgreSQL. Features real-time stock tracking and automated reordering.
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-sm">DesignerOS</h4>
                                            <span className="text-[10px] text-stone-400">Personal Project</span>
                                        </div>
                                        <p className="text-[11px] text-stone-700 leading-relaxed">
                                            An experimental web portfolio mimicking a desktop operating system. Features a window manager, virtual file system, and interactive timeline built with React and Framer Motion.
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-6 text-center">
                            <p className="text-[9px] text-stone-400 font-mono uppercase">
                                Generated by DesignerOS • {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
