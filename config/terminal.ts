
import { FileSystemNode } from '../types';

// 1. Local System (The "Desktop")
export const LOCAL_FS: FileSystemNode = {
    type: 'dir',
    children: {
        'Applications': {
            type: 'dir',
            children: {
                'Terminal.exe': { type: 'file', appId: 'terminal' },
                'SystemMonitor.exe': { type: 'file', appId: 'monitor' },
                'PixelPaint.exe': { type: 'file', appId: 'paint' },
                'ConspiracyBoard.exe': { type: 'file', appId: 'timeline' },
                'BlogReader.exe': { type: 'file', appId: 'blog' },
                'ImageGen.exe': { type: 'file', appId: 'image-generator' },
                'Browser.exe': { type: 'file', appId: 'browser' }
            }
        },
        'Remote Apps': {
            type: 'dir',
            children: {
                'VS Code Web.app': { type: 'file', appId: 'browser', src: 'https://vscode.dev' },
                'Figma.app': { type: 'file', appId: 'browser', src: 'https://www.figma.com' },
                'Spotify Web.app': { type: 'file', appId: 'browser', src: 'https://open.spotify.com' },
                'Excalidraw.app': { type: 'file', appId: 'browser', src: 'https://excalidraw.com' }
            }
        },
        'Documents': {
            type: 'dir',
            children: {
                'Work': {
                    type: 'dir',
                    children: {
                        'resume.pdf': { type: 'file', appId: 'resume' },
                        'portfolio.md': { type: 'file', content: '# Portfolio\n\n- React OS\n- E-Commerce Dashboard\n- AI Chatbot' },
                        'clients.txt': { type: 'file', content: 'Google\nMicrosoft\nStartups Inc.' }
                    }
                },
                'Personal': {
                    type: 'dir',
                    children: {
                        'notes.txt': { type: 'file', content: 'To do:\n1. Buy milk\n2. Fix CSS bugs\n3. Conquer world' },
                        'passwords.txt': { type: 'file', content: 'nice try... it is hashed.' }
                    }
                },
                'README.md': { type: 'file', content: 'Welcome to Cogito OS Terminal.\nUse "help" to see commands.\nTry "ssh admin@mainframe" to access the secure server.' }
            }
        },
        'Media': {
            type: 'dir',
            children: {
                'Wallpapers': {
                    type: 'dir',
                    children: {
                        'cyberpunk.png': { type: 'file', src: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=400&auto=format&fit=crop' },
                        'nature.jpg': { type: 'file', src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400&auto=format&fit=crop' },
                        'abstract.jpg': { type: 'file', src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&auto=format&fit=crop' }
                    }
                },
                'Videos': {
                    type: 'dir',
                    children: {
                        'Demo_PostHog.mp4': { type: 'file', src: 'https://ik.imagekit.io/ikmedia/sample_video.mp4' },
                        'Project_Teaser.mov': { type: 'file', src: 'https://www.w3schools.com/html/mov_bbb.mp4' }
                    }
                },
                'Research': {
                    type: 'dir',
                    children: {
                        'diagram_v1.png': { type: 'file', src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400&auto=format&fit=crop' }
                    }
                }
            }
        }
    }
};

// 2. Remote System (Simulated Server)
export const REMOTE_FS: FileSystemNode = {
    type: 'dir',
    children: {
        'var': {
            type: 'dir',
            children: {
                'www': { type: 'dir', children: { 'index.html': { type: 'file', content: '<html>Hello World</html>' } } },
                'logs': { type: 'dir', children: { 'access.log': { type: 'file', content: '[2025-01-01] User admin logged in.' } } }
            }
        },
        'secret_plans.txt': { type: 'file', content: 'TOP SECRET:\nThe design update will feature more brutalist typography.' }
    }
};
