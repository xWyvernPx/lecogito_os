
import { ContentItem } from '../types';
import { DESIGN_TOKENS } from '../theme/design-tokens';

export const APP_PRESETS: Record<string, { title: string; content: ContentItem[] }> = {
  'chatbot': {
      title: 'COGITO_AI.EXE',
      content: [
          { type: 'chatbot' } // Custom content type, but mapped in registry
      ]
  },
  'file-manager': {
      title: 'FILE_EXPLORER.EXE',
      content: [
          { type: 'file-manager', initialPath: '' }
      ]
  },
  'browser': {
      title: 'NETSCAPE_NAV.EXE',
      content: [
          { type: 'browser', src: 'https://www.google.com/webhp?igu=1' }
      ]
  },
  'app-creator': {
      title: 'APP_STUDIO.EXE',
      content: [
          { type: 'app-creator' as any } 
      ]
  },
  'kanban-board': {
      title: 'FLOW_BOARD.EXE',
      content: [
          { type: 'kanban-board' }
      ]
  },
  'display-settings': {
    title: 'DISPLAY_CFG.SYS',
    content: [
      { type: 'display-settings' } // Now using custom component
    ]
  },
  'image-generator': {
      title: 'IMAGEN.EXE',
      content: [
          { type: 'image-generator' }
      ]
  },
  'system-overview': {
    title: 'SYSTEM_PROPS.EXE',
    content: [
      { type: 'h1', text: 'System Information', sub: 'Cogito OS v1.0.25' },
      { type: 'line' },
      {
        type: 'table',
        headers: [{ text: 'Component', width: 'w-1/3' }, { text: 'Specification', width: 'w-2/3' }],
        rows: [
           ['Host', 'Browser Window (Chrome/Brave/Edge)'],
           ['Processor', '1x Hamster Wheel (Turbo Boosted)'],
           ['Memory', 'Shared with 50 other tabs'],
           ['Graphics', 'Canvas 2D Rendering Engine'],
           ['Uptime', 'Since you refreshed'],
           ['Coffee Level', 'Critical'],
        ]
      },
      { type: 'spacer', height: 20 },
      { type: 'h2', text: 'Experience Index' },
      {
          type: 'stats',
          stats: [
              { label: 'Visual Aesthetics', value: 99, color: '#ff7e33' },
              { label: 'Code Quality', value: 40, color: '#ef4444' }, // Joke
              { label: 'Bugs / Features', value: 100, color: '#3b82f6' }
          ]
      }
    ]
  },
  'system-storage': {
    title: 'DISK_USAGE_ANALYZER',
    content: [
       { type: 'h1', text: 'Storage Analysis', sub: '/dev/sda1' },
       { type: 'p', text: 'Calculating directory sizes... (This may take forever)' },
       { type: 'line' },
       {
          type: 'stats',
          stats: [
              { label: 'node_modules (Black Hole)', value: 95, color: '#121212' },
              { label: 'Actual Code', value: 1, color: '#22c55e' },
              { label: 'Assets', value: 4, color: '#3b82f6' }
          ]
       },
       { type: 'spacer', height: 20 },
       { type: 'h2', text: 'Largest Directories' },
       {
          type: 'table',
          headers: [{ text: 'Directory', width: 'w-1/2' }, { text: 'Size', width: 'w-1/2' }],
          rows: [
              ['/users/phong/projects/unfinished', '850 GB'],
              ['/users/phong/downloads', '120 GB (ISOs usually)'],
              ['/users/phong/desktop', '15 KB (Clean!)'],
              ['/var/log/npm-debug.log', '500 MB']
          ]
       },
       { type: 'button', text: '[ CLEAN UP DISK ]', action: 'trash' }
    ]
  },
  projects: {
    title: 'PROJECTS.MDX',
    content: [
      { type: 'h1', text: 'Work & Projects', sub: 'Selected works from 2021-2025' },
      { type: 'project-list' }
    ]
  },
  blog: {
    title: 'CHRONICLES.MD',
    content: [
        { type: 'blog-news' }
    ]
  },
  timeline: {
      title: 'THE_MASTER_PLAN.EXE',
      content: [
          { type: 'conspiracy-map' }
      ]
  },
  'event-editor': {
      title: 'EVIDENCE_LOCKER.EXE',
      content: [
          { type: 'event-editor' }
      ]
  },
  resume: {
      title: 'RESUME_VIEWER_PRO',
      content: [
          { type: 'resume-viewer' }
      ]
  },
  paint: {
      title: 'PIXEL_STUDIO.EXE',
      content: [
          { type: 'pixel-paint' }
      ]
  },
  monitor: {
      title: 'BTOP++.EXE',
      content: [
          { type: 'system-monitor' }
      ]
  },
  about: {
    title: 'CHAR_SHEET.EXE',
    content: [
      // Hero Section (Full Width)
      { 
          type: 'hero', 
          src: 'https://file-service.s3.amazonaws.com/1740927827829.jpeg', 
          alt: 'Phong Character Level Up'
      },
      
      // Bio
      { type: 'h2', text: 'CHARACTER BIO' },
      { type: 'p', text: "A biological machine that converts caffeine and pizza into clean (mostly) code. Specializes in building digital castles in the cloud and fighting distributed system dragons." },
      { type: 'p', text: "Current Status: Buffing infrastructure at Netcompany. Weakness: Merge conflicts." },
      
      // Stats Section
      { type: 'spacer', height: 10 },
      { type: 'h2', text: 'ATTRIBUTES & STATS' },
      { 
        type: 'stats',
        stats: [
          { label: 'Frontend Sorcery (React)', value: 92, color: DESIGN_TOKENS.colors.status.info },
          { label: 'Backend Alchemy (Node/Java)', value: 88, color: DESIGN_TOKENS.colors.status.success },
          { label: 'Coffee Dependency', value: 100, color: '#78350f' },
          { label: 'Div Centering Skills', value: 65, color: DESIGN_TOKENS.colors.status.error }, // The joke
          { label: 'Google-Fu / StackOverflow', value: 99, color: DESIGN_TOKENS.colors.status.warning },
          { label: 'Infrastructure / DevOps', value: 75, color: '#6366f1' },
        ]
      },

      // Visual Loadout (AI Generator Replacement)
      { type: 'spacer', height: 20 },
      { type: 'h2', text: 'AI VISUALIZATION UNIT' },
      { type: 'p', text: 'Equip your character with custom artifacts generated by the Nano Banana neural engine.' },
      { type: 'image-generator' },

      // Experience (Quest Log)
      { type: 'spacer', height: 20 },
      { type: 'h2', text: 'QUEST LOG (EXPERIENCE)' },
      { 
        type: 'quest-log',
        quests: [
            {
              title: 'Full Stack Consultant',
              organization: 'Netcompany',
              period: '2023 - Present',
              status: 'active',
              description: 'Currently engaged in the "SCOT Project" campaign. Orchestrating supply chain movements for the Roche faction. Navigating complex distributed system dungeons and battling legacy code bosses using modern artifacts.',
              tags: ['Spring Boot', 'React', 'Oracle SQL', 'Azure'],
              image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop' // Code screen
            },
            {
              title: 'Software Engineer',
              organization: 'Hanbiro',
              period: '2021 - 2023',
              status: 'completed',
              description: 'Successfully completed the "Monolith Migration" raid. Unlocked the "Microservices" achievement by dismantling the legacy beast. Crafted internal tools that buffed team efficiency by +50%.',
              tags: ['Java', 'Microservices', 'Redis', 'Docker'],
              image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1000&auto=format&fit=crop' // Server room
            }
        ]
      },

      // Tech Stack (Inventory)
      { type: 'spacer', height: 10 },
      { type: 'h2', text: 'INVENTORY & SPELLS' },
      { 
          type: 'table',
          headers: [{ text: 'Item Type', width: 'w-[30%]' }, { text: 'Equipped Items', width: 'w-[70%]' }],
          rows: [
              [
                'Scrolls (Languages)', 
                { type: 'tags', tags: ['JavaScript', 'TypeScript', 'Java', 'SQL'] }
              ],
              [
                'Artifacts (Frameworks)', 
                { type: 'tags', tags: ['React', 'Spring Boot', 'Express', 'NestJs'] }
              ],
              [
                'Storage (DB)', 
                { type: 'tags', tags: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'] }
              ],
              [
                'Environment (Cloud)', 
                { type: 'tags', tags: ['AWS', 'Docker', 'K8s', 'CircleCI'] }
              ]
          ]
      },

      // Loot
      { type: 'spacer', height: 10 },
      { type: 'h2', text: 'RARE LOOT (AWARDS)' },
      { 
        type: 'table',
        headers: [
            { text: 'Item Name', width: 'w-1/3' },
            { text: 'Source', width: 'w-1/4' },
            { text: 'Stats', width: 'w-5/12' }
        ],
        rows: [
            ['Honor Student Medal', 'FPT Univ', '+10 Intelligence. Maintained > B Rank for 6 seasons.'],
            ['CTF 5th Place Trophy', 'Secathon VI', '+15 Hacking. Survived OWASP dungeon.']
        ]
      },

      // Connect
      { type: 'spacer', height: 20 },
      { type: 'line' },
      { type: 'h2', text: "SUMMONING RITUALS" },
      { type: 'p', text: "To summon me for a quest, utilize the following communication crystals:" },
      
      { type: 'button', text: '[ EQUIP RESUME.PDF ]', action: 'resume' },
      
      { type: 'spacer', height: 10 },
      { 
        type: 'table', 
        headers: [
            { text: 'Portal', width: 'w-[30%]' },
            { text: 'Coordinates', width: 'w-[70%]' }
        ],
        rows: [
            [
              'LinkedIn', 
              { type: 'link', text: 'linkedin.com/in/thanhphong2506', url: 'https://www.linkedin.com/in/thanhphong2506' }
            ],
            [
              'GitHub', 
              { type: 'link', text: 'github.com/xWyvernPx', url: 'https://github.com/xWyvernPx' }
            ],
            [
              'Telegram', 
              { type: 'link', text: 't.me/xWyvernPx', url: 'https://t.me/xWyvernPx' }
            ],
        ]
      }
    ]
  },
  welcome: {
    title: 'README.MD',
    content: [
      { type: 'h1', text: 'Cogito OS v1.0.25', sub: 'Welcome to the Nerve Center' },
      { type: 'line' },
      { type: 'p', text: 'This terminal provides a unified interface to my digital career, projects, and architectural experiments. System integrity: 100%.' },
      
      { type: 'h2', text: '> SYSTEM STATUS' },
      {
        type: 'table',
        headers: [{ text: 'Module', width: 'w-1/2' }, { text: 'Uptime', width: 'w-1/2' }],
        rows: [
           ['Framer Motion Engine', 'OPERATIONAL'],
           ['Nano Banana AI Core', 'ONLINE'],
           ['Satellite Surveillance', 'TRACKING'],
           ['Coffee Reserves', 'LOW (30%)'],
        ]
      },

      { type: 'h2', text: '> USER MANUAL' },
      { type: 'list', text: 'NAVIGATION: Double-click desktop icons to initialize applications.' },
      { type: 'list', text: 'MULTITASKING: Use Workspaces (1-5) in the top bar to organize your windows.' },
      { type: 'list', text: 'QUICK ACTIONS: Right-click the desktop or icons for context-aware commands.' },
      { type: 'list', text: 'MAINTENANCE: Click the Coffee icon in the top bar to refill system caffeine levels.' },
      { type: 'list', text: 'TERMINAL: Open the ACTIVITIES menu to access the low-level shell (CogitoOS).' },

      { type: 'h2', text: '> LATEST UPDATES (SEPT 2025)' },
      { type: 'p', text: '[NEW] "TIMELINE" app declassified. Explore the career conspiracy via Case Board or Satellite imagery.' },
      { type: 'p', text: '[UPDATE] "SCRIBE DESK" integrated into Chronicles. Markdown editing with obsidian-style callouts enabled.' },
      { type: 'p', text: '[HOTFIX] Fixed centering div issues (Simulated).' },
      
      { type: 'spacer', height: 20 },
      { type: 'button', text: '[ ACCESS_PORTFOLIO_LIST ]', action: 'projects' },
    ]
  },
  contact: {
    title: 'CONTACT.TXT',
    content: [
      { type: 'h1', text: 'Contact Channels' },
      { type: 'line' },
      { type: 'p', text: 'Reach out via the following frequencies:' },
      { type: 'spacer', height: 20 },
      { 
        type: 'table', 
        headers: [
            { text: 'Channel', width: 'w-1/3' },
            { text: 'Address', width: 'w-2/3' }
        ],
        rows: [
            ['Email', { type: 'link', text: 'phonglethanh2@gmail.com', url: 'mailto:phonglethanh2@gmail.com' }],
            ['LinkedIn', { type: 'link', text: '@thanhphong2506', url: 'https://www.linkedin.com/in/thanhphong2506' }],
            ['GitHub', { type: 'link', text: 'github.com/xWyvernPx', url: 'https://github.com/xWyvernPx' }],
        ]
      },
      { type: 'spacer', height: 20 },
      { type: 'button', text: '[ SEND EMAIL ]', link: 'mailto:phonglethanh2@gmail.com' }
    ]
  },
  trash: {
    title: 'TRASH BIN',
    content: [
      { type: 'h1', text: 'Recycle Bin' },
      { type: 'p', text: 'Restoring these files might break the space-time continuum.' },
      { type: 'line' },
      { 
        type: 'table', 
        headers: [
            { text: 'Filename', width: 'w-[45%]' },
            { text: 'Size', width: 'w-[25%]' },
            { text: 'Deleted', width: 'w-[30%]' }
        ],
        rows: [
            ['node_modules', 'Heavy', 'Every day'],
            ['fix_centering_div_final_FINAL_v3.css', '12 KB', '2am'],
            ['unused_side_projects/', '500 TB', '2020-2024'],
            ['ie6_support_patch.js', '666 KB', 'The Dark Ages'],
            ['"One last fix" commit', 'N/A', 'Before deploy']
        ]
      },
      { type: 'spacer', height: 20 },
      { type: 'h2', text: '> SYSTEM WARNING' },
      { type: 'p', text: 'Attempting to delete "node_modules" usually results in a black hole.' },
      { type: 'spacer', height: 10 },
      { type: 'button', text: '[ INCINERATE ANYWAY ]' }
    ]
  },
  terminal: {
    title: 'TERMINAL.EXE',
    content: [{ type: 'terminal' }]
  }
};
