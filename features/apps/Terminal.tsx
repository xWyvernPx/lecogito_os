
import React, { useRef, useEffect } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useOSStore } from '../os/stores/os-store';
import { LOCAL_FS } from '../../config/terminal';
import { FileSystemNode } from '../../types';

// ANSI Colors
const C = {
    RESET: '\x1b[0m',
    BRIGHT: '\x1b[1m',
    DIM: '\x1b[2m',
    GREEN: '\x1b[32m',
    BLUE: '\x1b[34m',
    CYAN: '\x1b[36m',
    RED: '\x1b[31m',
    YELLOW: '\x1b[33m',
    MAGENTA: '\x1b[35m',
    WHITE: '\x1b[37m',
};

export const Terminal: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const termRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const { spawnWindow } = useOSStore();

    // Shell State (Refs to avoid stale closures in event listeners)
    const state = useRef({
        input: '',
        cursor: 0,
        user: 'guest',
        host: 'cogito-os',
        path: [] as string[],
        history: [] as string[],
        historyIndex: -1,
        isSsh: false
    });

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize xterm.js
        const term = new XTerm({
            cursorBlink: true,
            fontFamily: '"Courier Prime", monospace',
            fontSize: 14,
            lineHeight: 1.2,
            theme: {
                background: '#1e1e1e',
                foreground: '#fdfdfd',
                cursor: 'var(--os-accent)',
                selectionBackground: 'rgba(255, 126, 51, 0.3)',
                black: '#1e1e1e',
                red: '#ef4444',
                green: '#22c55e',
                yellow: '#eab308',
                blue: '#3b82f6',
                magenta: '#a855f7',
                cyan: '#06b6d4',
                white: '#fdfdfd',
            }
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(containerRef.current);
        fitAddon.fit();

        termRef.current = term;
        fitAddonRef.current = fitAddon;

        // Welcome Message
        term.writeln(`${C.GREEN}Welcome to Cogito OS Terminal [v1.0.25]${C.RESET}`);
        term.writeln(`Type ${C.YELLOW}'help'${C.RESET} for available commands.`);
        term.writeln(`Type ${C.YELLOW}'ssh user@host'${C.RESET} to connect to remote server.`);
        term.writeln('');
        prompt();

        // Focus terminal on click
        containerRef.current.addEventListener('click', () => term.focus());

        // Handle Input
        term.onData(e => {
            switch (e) {
                case '\r': // Enter
                    term.write('\r\n');
                    executeCommand(state.current.input.trim());
                    state.current.input = '';
                    state.current.cursor = 0;
                    break;
                case '\u007F': // Backspace
                    if (state.current.input.length > 0) {
                        state.current.input = state.current.input.substring(0, state.current.input.length - 1);
                        state.current.cursor--;
                        term.write('\b \b');
                    }
                    break;
                case '\u0003': // Ctrl+C
                    term.write('^C\r\n');
                    state.current.input = '';
                    prompt();
                    break;
                default:
                    // Regular character
                    if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7e)) {
                        state.current.input += e;
                        state.current.cursor++;
                        term.write(e);
                    }
            }
        });

        // Resize Observer
        const resizeObserver = new ResizeObserver(() => fitAddon.fit());
        resizeObserver.observe(containerRef.current);

        return () => {
            term.dispose();
            resizeObserver.disconnect();
        };
    }, []);

    const prompt = () => {
        const { user, host, path } = state.current;
        const pathStr = path.length === 0 ? '~' : '/' + path.join('/');
        termRef.current?.write(`${C.GREEN}${user}@${host}${C.RESET}:${C.BLUE}${pathStr}${C.RESET}$ `);
    };

    const executeCommand = (cmdStr: string) => {
        const term = termRef.current;
        if (!term) return;

        if (!cmdStr) {
            prompt();
            return;
        }

        const parts = cmdStr.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        state.current.history.push(cmdStr);

        switch (cmd) {
            case 'help':
                term.writeln('  ls       List directory contents');
                term.writeln('  cd       Change directory');
                term.writeln('  clear    Clear the terminal screen');
                term.writeln('  cat      Concatenate and print files');
                term.writeln('  open     Open a GUI application (e.g., projects)');
                term.writeln('  ssh      Open SSH connection (Simulated)');
                term.writeln('  exit     Logout');
                break;
            case 'clear':
                term.clear();
                break;
            case 'ls':
                // Simulated File System Listing
                const node = getNode(state.current.path);
                if(node && node.children) {
                    const items = Object.keys(node.children).map(k => {
                        const isDir = node.children![k].type === 'dir';
                        return isDir ? `${C.BLUE}${k}/${C.RESET}` : k;
                    });
                    term.writeln(items.join('  '));
                }
                break;
            case 'cd':
                const target = args[0] || '~';
                if (target === '~') {
                    state.current.path = [];
                } else if (target === '..') {
                    state.current.path.pop();
                } else {
                    const newPath = [...state.current.path, target];
                    const targetNode = getNode(newPath);
                    if (targetNode && targetNode.type === 'dir') {
                        state.current.path = newPath;
                    } else {
                        term.writeln(`cd: ${target}: No such directory`);
                    }
                }
                break;
            case 'ssh':
                if (args.length === 0) {
                    term.writeln('usage: ssh user@hostname');
                } else {
                    term.writeln(`Connecting to ${args[0]}...`);
                    setTimeout(() => {
                        term.write('Password: ');
                        // Simple hack: next input hides characters or just auto-logins
                        setTimeout(() => {
                            term.writeln('\r\nAuthenticated.');
                            state.current.isSsh = true;
                            const [u, h] = args[0].split('@');
                            state.current.user = u || 'root';
                            state.current.host = h || 'remote';
                            prompt();
                        }, 1000);
                    }, 500);
                    return; // Prompt handled asynchronously
                }
                break;
            case 'open':
                if (args[0]) {
                    spawnWindow(args[0]);
                    term.writeln(`Launching ${args[0]}...`);
                } else {
                    term.writeln('usage: open <app_id>');
                }
                break;
            case 'exit':
                if (state.current.isSsh) {
                    state.current.isSsh = false;
                    state.current.user = 'guest';
                    state.current.host = 'cogito-os';
                    term.writeln('Connection closed.');
                } else {
                    term.writeln('Logout not supported in simulation.');
                }
                break;
            default:
                term.writeln(`command not found: ${cmd}`);
        }

        prompt();
    };

    const getNode = (path: string[]): FileSystemNode | null => {
        let current = LOCAL_FS;
        for (const p of path) {
            if (current.children && current.children[p]) {
                current = current.children[p];
            } else {
                return null;
            }
        }
        return current;
    };

    return (
        <div className="w-full h-full bg-[#1e1e1e] p-2 overflow-hidden">
            <div ref={containerRef} className="w-full h-full" />
        </div>
    );
};
