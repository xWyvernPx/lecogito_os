
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Server, Activity, HardDrive, Wifi, Lock, Terminal, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../os/hooks/use-translation';

// --- Types ---
interface SystemStats {
    cpu: number[]; // History for graph
    cores: number[];
    ram: number;
    swap: number;
    netDown: number[];
    netUp: number[];
    disk: number;
    processes: Process[];
}

interface Process {
    pid: number;
    name: string;
    cpu: number;
    mem: number;
    user: string;
}

// --- Mock Data Generators ---
const generateProcessList = (isRemote: boolean): Process[] => {
    const processes = [
        { name: 'chrome', baseCpu: 15, baseMem: 20 },
        { name: 'node', baseCpu: 5, baseMem: 10 },
        { name: 'docker', baseCpu: 2, baseMem: 15 },
        { name: 'kworker', baseCpu: 0.1, baseMem: 0.1 },
        { name: 'systemd', baseCpu: 0.1, baseMem: 0.5 },
        { name: 'spotify', baseCpu: 2, baseMem: 5 },
        { name: 'vscode', baseCpu: 8, baseMem: 12 },
        { name: 'kernel_task', baseCpu: 1, baseMem: 8 },
    ];

    return processes.map(p => ({
        pid: Math.floor(Math.random() * 30000),
        name: p.name,
        user: isRemote ? 'root' : 'phong',
        cpu: Math.max(0, p.baseCpu + (Math.random() * 10 - 5)),
        mem: Math.max(0, p.baseMem + (Math.random() * 5 - 2.5))
    })).sort((a, b) => b.cpu - a.cpu);
};

// --- Sub-components for Graphs ---
const Sparkline = ({ data, color, fill }: { data: number[], color: string, fill?: boolean }) => {
    const max = 100;
    const width = 100;
    const height = 100;
    const step = width / (data.length - 1);
    
    const path = data.map((val, i) => {
        const x = i * step;
        const y = height - (val / max) * height;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const fillPath = `${path} L ${width} ${height} L 0 ${height} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
            {fill && <path d={fillPath} fill={color} fillOpacity="0.2" />}
            <path d={path} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
    );
};

const ProgressBar: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
    <div className="flex items-center gap-2 text-[10px] font-mono mb-1">
        <span className="w-8 text-stone-400">{label}</span>
        <div className="flex-1 h-3 bg-stone-800 border border-stone-700 relative overflow-hidden">
            <motion.div 
                className="h-full relative"
                style={{ backgroundColor: color }}
                animate={{ width: `${value}%` }}
                transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}
            >
                <div className="absolute right-0 top-0 bottom-0 w-px bg-white/50" />
            </motion.div>
        </div>
        <span className="w-8 text-right font-bold">{Math.round(value)}%</span>
    </div>
);

export const SystemMonitor: React.FC = () => {
    const { t } = useTranslation();
    const [isRemote, setIsRemote] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [connectionStep, setConnectionStep] = useState(0);
    
    // Remote Credentials
    const [host, setHost] = useState('192.168.1.50');
    const [user, setUser] = useState('root');

    // Real Hardware Info (Best Effort)
    const logicalProcessors = navigator.hardwareConcurrency || 4;
    // @ts-ignore - memory is a Chrome extension
    const memoryInfo = (performance as any).memory; 

    // Stats State
    const [stats, setStats] = useState<SystemStats>({
        cpu: Array(40).fill(0),
        cores: Array(logicalProcessors).fill(0),
        ram: 40,
        swap: 10,
        netDown: Array(40).fill(0),
        netUp: Array(40).fill(0),
        disk: 45,
        processes: []
    });

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => {
                let currentCpu = 0;
                let currentRam = 0;

                if (!isRemote && memoryInfo) {
                    // Use Real Browser Memory if available (Chrome)
                    const used = memoryInfo.usedJSHeapSize;
                    const total = memoryInfo.jsHeapSizeLimit;
                    currentRam = (used / total) * 100;
                    // Simulate CPU based on some randomness + baseline
                    currentCpu = Math.min(100, Math.max(5, (Math.random() * 20))); 
                } else {
                    // Fully simulated
                    const loadFactor = isRemote ? 1.5 : 1; 
                    currentCpu = Math.min(100, Math.max(5, (Math.random() * 30 + 10) * loadFactor));
                    currentRam = Math.min(98, 30 + Math.random() * 10 + (isRemote ? 30 : 0));
                }
                
                // Shift arrays
                const historyCpu = [...prev.cpu.slice(1), currentCpu];
                const historyDown = [...prev.netDown.slice(1), Math.random() * (isRemote ? 80 : 10)];
                const historyUp = [...prev.netUp.slice(1), Math.random() * (isRemote ? 40 : 5)];

                return {
                    cpu: historyCpu,
                    cores: prev.cores.map(() => Math.min(100, Math.random() * 100 * (isRemote ? 1.5 : 0.8))),
                    ram: currentRam,
                    swap: isRemote ? 40 : 5,
                    netDown: historyDown,
                    netUp: historyUp,
                    disk: isRemote ? 88 : 45,
                    processes: generateProcessList(isRemote)
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRemote, memoryInfo]);

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        setConnecting(true);
        setConnectionStep(0);

        // Simulated Handshake
        const steps = [
            () => setConnectionStep(1), // Resolving host...
            () => setConnectionStep(2), // Handshaking...
            () => setConnectionStep(3), // Verifying keys...
            () => {
                setConnecting(false);
                setIsRemote(true);
                setShowLogin(false);
            }
        ];

        steps.forEach((step, i) => setTimeout(step, (i + 1) * 800));
    };

    const handleDisconnect = () => {
        setIsRemote(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#161616] text-[#ebdbb2] font-mono select-none overflow-hidden relative">
            
            {/* Login Overlay */}
            <AnimatePresence>
                {showLogin && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-sm bg-[#1d2021] border-2 border-[#d65d0e] shadow-[0_0_30px_rgba(214,93,14,0.2)] p-6"
                        >
                            <div className="flex items-center gap-2 mb-6 border-b border-[#3c3836] pb-2 text-[#d65d0e]">
                                <Terminal size={18} />
                                <h3 className="font-bold text-sm">{t('mon.ssh_title')}</h3>
                            </div>
                            
                            {!connecting ? (
                                <form onSubmit={handleConnect} className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] uppercase text-[#a89984] mb-1">{t('mon.host')}</label>
                                        <input type="text" value={host} onChange={e => setHost(e.target.value)} className="w-full bg-[#282828] border border-[#504945] px-3 py-2 text-sm outline-none focus:border-[#d65d0e] text-[#ebdbb2]" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase text-[#a89984] mb-1">{t('mon.user')}</label>
                                        <input type="text" value={user} onChange={e => setUser(e.target.value)} className="w-full bg-[#282828] border border-[#504945] px-3 py-2 text-sm outline-none focus:border-[#d65d0e] text-[#ebdbb2]" />
                                    </div>
                                    <div className="flex justify-end gap-2 mt-6">
                                        <button type="button" onClick={() => setShowLogin(false)} className="px-4 py-2 text-xs font-bold hover:bg-[#3c3836] text-[#a89984]">{t('common.cancel').toUpperCase()}</button>
                                        <button type="submit" className="px-4 py-2 bg-[#d65d0e] text-[#1d2021] text-xs font-bold hover:bg-[#fe8019] flex items-center gap-2">
                                            <Lock size={12} /> {t('common.connect').toUpperCase()}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-2 py-4 font-mono text-xs">
                                    <div className={`flex items-center gap-2 ${connectionStep >= 0 ? 'text-[#b8bb26]' : 'text-stone-600'}`}>
                                        {connectionStep === 0 && <RefreshCw size={10} className="animate-spin" />}
                                        [1] {t('mon.resolving')}
                                    </div>
                                    <div className={`flex items-center gap-2 ${connectionStep >= 1 ? 'text-[#b8bb26]' : 'text-stone-600'}`}>
                                        {connectionStep === 1 && <RefreshCw size={10} className="animate-spin" />}
                                        [2] {t('mon.handshake')}
                                    </div>
                                    <div className={`flex items-center gap-2 ${connectionStep >= 2 ? 'text-[#b8bb26]' : 'text-stone-600'}`}>
                                        {connectionStep === 2 && <RefreshCw size={10} className="animate-spin" />}
                                        [3] {t('mon.verifying')}
                                    </div>
                                    <div className={`flex items-center gap-2 ${connectionStep >= 3 ? 'text-[#b8bb26]' : 'text-stone-600'}`}>
                                        [4] {t('mon.secure')}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Toolbar */}
            <div className="h-10 border-b border-[#3c3836] bg-[#1d2021] flex items-center justify-between px-3 shrink-0">
                <div className="flex items-center gap-2">
                    <Activity size={14} className="text-[#d65d0e]" />
                    <span className="text-xs font-bold tracking-wider">BTOP++</span>
                    <div className="h-4 w-px bg-[#3c3836] mx-2" />
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isRemote ? 'bg-[#cc241d] text-white' : 'bg-[#689d6a] text-[#1d2021]'}`}>
                        {isRemote ? `SSH: ${user}@${host}` : t('mon.local')}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {!isRemote && (
                        <div className="hidden md:flex items-center gap-1 text-[10px] text-[#a89984] mr-2">
                            <AlertTriangle size={10} />
                            <span>Showing Browser VM Stats</span>
                        </div>
                    )}
                    {isRemote ? (
                        <button onClick={handleDisconnect} className="flex items-center gap-1 text-[10px] bg-[#3c3836] hover:bg-[#504945] px-2 py-1 rounded transition-colors text-[#fb4934]">
                            <X size={10} /> {t('common.disconnect').toUpperCase()}
                        </button>
                    ) : (
                        <button onClick={() => setShowLogin(true)} className="flex items-center gap-1 text-[10px] bg-[#3c3836] hover:bg-[#504945] px-2 py-1 rounded transition-colors text-[#83a598]">
                            <Server size={10} /> {t('mon.remote')}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 overflow-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                
                {/* 1. CPU Module (Large Top Left) */}
                <div className="lg:col-span-8 bg-[#1d2021] border border-[#3c3836] rounded-sm p-4 flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4 z-10">
                        <h3 className="text-xs font-bold text-[#a89984] flex items-center gap-2"><Cpu size={14} /> {t('mon.cpu')}</h3>
                        <span className="text-xl font-bold text-[#ebdbb2]">{Math.round(stats.cpu[stats.cpu.length - 1])}%</span>
                    </div>
                    
                    {/* Main Graph */}
                    <div className="h-32 mb-4 bg-[#282828] border border-[#3c3836] relative">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#3c3836 1px, transparent 1px), linear-gradient(90deg, #3c3836 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                        <Sparkline data={stats.cpu} color={isRemote ? '#fb4934' : '#fabd2f'} fill />
                    </div>

                    {/* Cores */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                        {stats.cores.map((core, i) => (
                            <ProgressBar key={i} label={`C${i}`} value={core} color={isRemote ? '#cc241d' : '#fe8019'} />
                        ))}
                    </div>
                </div>

                {/* 2. Memory & Disk (Right Col) */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    {/* RAM */}
                    <div className="flex-1 bg-[#1d2021] border border-[#3c3836] rounded-sm p-4">
                        <h3 className="text-xs font-bold text-[#a89984] mb-3 flex items-center gap-2"><Activity size={14} /> {t('mon.memory')}</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span>RAM</span>
                                    <span>{Math.round(stats.ram)}% {t('mon.used')}</span>
                                </div>
                                <div className="h-4 bg-[#282828] border border-[#3c3836]">
                                    <motion.div 
                                        className="h-full bg-[#b8bb26]" 
                                        animate={{ width: `${stats.ram}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span>SWAP</span>
                                    <span>{Math.round(stats.swap)}%</span>
                                </div>
                                <div className="h-4 bg-[#282828] border border-[#3c3836]">
                                    <motion.div 
                                        className="h-full bg-[#d3869b]" 
                                        animate={{ width: `${stats.swap}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DISK */}
                    <div className="flex-1 bg-[#1d2021] border border-[#3c3836] rounded-sm p-4">
                        <h3 className="text-xs font-bold text-[#a89984] mb-3 flex items-center gap-2"><HardDrive size={14} /> {t('mon.disk')}</h3>
                        <div className="flex gap-4">
                            <div className="flex-1 text-center border border-[#3c3836] p-2 bg-[#282828]">
                                <span className="text-[10px] text-[#83a598]">{t('mon.used')}</span>
                                <div className="text-lg font-bold">{stats.disk}%</div>
                            </div>
                            <div className="flex-1 text-center border border-[#3c3836] p-2 bg-[#282828]">
                                <span className="text-[10px] text-[#83a598]">{t('mon.free')}</span>
                                <div className="text-lg font-bold">{100 - stats.disk}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Network (Bottom Left) */}
                <div className="lg:col-span-4 bg-[#1d2021] border border-[#3c3836] rounded-sm p-4">
                    <h3 className="text-xs font-bold text-[#a89984] mb-3 flex items-center gap-2"><Wifi size={14} /> {t('mon.network')}</h3>
                    <div className="flex flex-col gap-4 h-full">
                        <div className="flex-1">
                            <div className="flex justify-between text-[10px] mb-1 text-[#8ec07c]">
                                <span>{t('mon.download')}</span>
                                <span>{Math.round(stats.netDown[stats.netDown.length-1])} Mbps</span>
                            </div>
                            <div className="h-16 bg-[#282828] border border-[#3c3836]">
                                <Sparkline data={stats.netDown} color="#8ec07c" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-[10px] mb-1 text-[#458588]">
                                <span>{t('mon.upload')}</span>
                                <span>{Math.round(stats.netUp[stats.netUp.length-1])} Mbps</span>
                            </div>
                            <div className="h-16 bg-[#282828] border border-[#3c3836]">
                                <Sparkline data={stats.netUp} color="#458588" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Processes (Bottom Right) */}
                <div className="lg:col-span-8 bg-[#1d2021] border border-[#3c3836] rounded-sm p-4 flex flex-col">
                    <h3 className="text-xs font-bold text-[#a89984] mb-3 flex items-center gap-2"><Terminal size={14} /> {t('mon.processes')}</h3>
                    <div className="flex-1 overflow-hidden relative">
                        <table className="w-full text-left text-[10px] font-mono">
                            <thead className="bg-[#3c3836] text-[#ebdbb2] sticky top-0">
                                <tr>
                                    <th className="p-1 pl-2">PID</th>
                                    <th className="p-1">USER</th>
                                    <th className="p-1">CPU%</th>
                                    <th className="p-1">MEM%</th>
                                    <th className="p-1">NAME</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3c3836]">
                                {stats.processes.map(p => (
                                    <tr key={p.pid} className="hover:bg-[#282828] transition-colors">
                                        <td className="p-1 pl-2 text-[#928374]">{p.pid}</td>
                                        <td className="p-1 text-[#d3869b]">{p.user}</td>
                                        <td className={`p-1 ${p.cpu > 10 ? 'text-[#cc241d] font-bold' : ''}`}>{p.cpu.toFixed(1)}</td>
                                        <td className="p-1">{p.mem.toFixed(1)}</td>
                                        <td className="p-1 font-bold text-[#ebdbb2]">{p.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};
