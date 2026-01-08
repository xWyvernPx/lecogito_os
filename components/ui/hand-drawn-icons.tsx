
import React, { useState, useEffect } from 'react';
import { IconType } from '../../types';
import { DESIGN_TOKENS } from '../../theme/design-tokens';

interface HandDrawnIconProps {
  type: IconType;
  size?: number;
  className?: string;
}

// Icon cache to prevent re-fetching
const iconCache = new Map<string, string>();

// Additional available icons for custom use
export const AVAILABLE_ICONS = {
  folder: '/assets/icons/folder.svg',
  file: '/assets/icons/file.svg',
  image: '/assets/icons/image-file.svg',
  music: '/assets/icons/music.svg',
  video: '/assets/icons/picture.svg',
  code: '/assets/icons/document.svg',
  terminal: '/assets/icons/toolbox.svg',
  archive: '/assets/icons/box.svg',
  mail: '/assets/icons/mailbox.svg',
  news: '/assets/icons/news.svg',
  trash: '/assets/icons/trash.svg',
  about: '/assets/icons/about.svg',
  binoculars: '/assets/icons/binoculars.svg',
  bookmark: '/assets/icons/bookmark.svg',
  bookmark2: '/assets/icons/bookmark-2.svg',
  bookmark3: '/assets/icons/bookmark-3.svg',
  bookmark4: '/assets/icons/bookmark-4.svg',
  box: '/assets/icons/box.svg',
  box2: '/assets/icons/box-2.svg',
  briefcase: '/assets/icons/briefcase.svg',
  checkMark: '/assets/icons/check-mark.svg',
  clock: '/assets/icons/clock.svg',
  clock2: '/assets/icons/clock-2.svg',
  close: '/assets/icons/close.svg',
  connect: '/assets/icons/connect.svg',
  contacts: '/assets/icons/contacts.svg',
  delete: '/assets/icons/delete.svg',
  document: '/assets/icons/document.svg',
  editPencil: '/assets/icons/edit-pencil.svg',
  externalLink: '/assets/icons/external-link.svg',
  home: '/assets/icons/home.svg',
  idea: '/assets/icons/idea.svg',
  imageFile: '/assets/icons/image-file.svg',
  key: '/assets/icons/key.svg',
  lock: '/assets/icons/lock.svg',
  mailbox: '/assets/icons/mailbox.svg',
  maleUser: '/assets/icons/male-user.svg',
  menu: '/assets/icons/menu.svg',
  openedFolder: '/assets/icons/opened-folder.svg',
  picture: '/assets/icons/picture.svg',
  plus: '/assets/icons/plus.svg',
  puzzle: '/assets/icons/puzzle.svg',
  refresh: '/assets/icons/refresh.svg',
  reminders: '/assets/icons/reminders.png',
  restart: '/assets/icons/restart.svg',
  rickSanchez: '/assets/icons/rick-sanchez.svg',
  round: '/assets/icons/round.svg',
  search: '/assets/icons/search.svg',
  share: '/assets/icons/share.svg',
  speechBubble: '/assets/icons/speech-bubble.svg',
  sun: '/assets/icons/sun.svg',
  sun2: '/assets/icons/sun-2.svg',
  synchronize: '/assets/icons/synchronize.svg',
  toolbox: '/assets/icons/toolbox.svg',
  trashCan: '/assets/icons/trash-can.svg',
  userFemale: '/assets/icons/user-female.svg',
} as const;

export const HandDrawnIcon: React.FC<HandDrawnIconProps> = ({ type, size = 48, className = '' }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const externalIconPath = AVAILABLE_ICONS[type];

  // Load external SVG if available, with caching
  useEffect(() => {
    if (!externalIconPath) return;

    // Check cache first
    const cached = iconCache.get(externalIconPath);
    if (cached) {
      setSvgContent(cached);
      return;
    }

    // Fetch and cache
    fetch(externalIconPath)
      .then(res => res.text())
      .then(svg => {
        iconCache.set(externalIconPath, svg);
        setSvgContent(svg);
      })
      .catch(() => {
        // Fallback to inline SVG on error
        setSvgContent(null);
      });
  }, [externalIconPath]);

  // Use external SVG if loaded
  if (externalIconPath && svgContent) {
    return (
      <div 
        className={className}
        style={{ 
          width: size, 
          height: size,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        dangerouslySetInnerHTML={{ 
          __html: svgContent.replace(
            /<svg/,
            `<svg width="${size}" height="${size}" style="width: ${size}px; height: ${size}px;"`
          )
        }}
      />
    );
  }

  // Handle PNG files separately
  if (externalIconPath && externalIconPath.endsWith('.png')) {
    return (
      <img
        src={externalIconPath}
        alt=""
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: 'contain'
        }}
      />
    );
  }

  // Fallback to inline hand-drawn SVGs
  const strokeColor = DESIGN_TOKENS.colors.os.border; // #121212
  const strokeWidth = 2.5;
  const accentColor = DESIGN_TOKENS.colors.os.accent; // #ff7e33
  
  // Base Paper Path used for most file types
  const FileBase = ({ children, fill = "#fdfdfd" }: { children?: React.ReactNode, fill?: string }) => (
    <>
      <path d="M32 6H12C9.79086 6 8 7.79086 8 10V38C8 40.2091 9.79086 42 12 42H36C38.2091 42 40 40.2091 40 38V14L32 6Z" fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <path d="M32 6V12C32 13.1046 32.8954 14 34 14H40" fill="#e5e7eb" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
      {children}
    </>
  );

  switch (type) {
    case 'folder':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
           <path d="M40 14H24l-4-4H8c-2.2 0-4 1.8-4 4v8h40v-4c0-2.2-1.8-4-4-4z" fill="#fbbf24" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
           <path d="M8 14C5.79086 14 4 15.7909 4 15.7909V40C4 42.2091 5.79086 44 8 44H40C42.2091 44 44 42.2091 44 40V15.7909C44 15.7909 42.2091 14 40 14H8Z" fill="#fcd34d" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
           <path d="M12 24H22" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    case 'file':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <FileBase>
             <path d="M16 22H32" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
             <path d="M16 28H32" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
             <path d="M16 34H26" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
          </FileBase>
        </svg>
      );
    case 'image':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <FileBase fill="#f3e8ff">
             <rect x="14" y="20" width="20" height="14" fill="#a855f7" stroke={strokeColor} strokeWidth="1.5" />
             <circle cx="20" cy="24" r="1.5" fill="#fff" />
             <path d="M14 30L19 25L24 30L27 27L34 34H14V30Z" fill="#e9d5ff" />
          </FileBase>
        </svg>
      );
    case 'music':
        return (
          <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <FileBase fill="#dbeafe">
                <path d="M20 34C17.7909 34 16 32.2091 16 30C16 27.7909 17.7909 26 20 26C22.2091 26 24 27.7909 24 30V20L32 18V28C32 30.2091 30.2091 32 28 32C25.7909 32 24 30.2091 24 28" fill="#3b82f6" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </FileBase>
          </svg>
        );
    case 'video':
        return (
          <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <FileBase fill="#fee2e2">
                <rect x="14" y="20" width="20" height="14" rx="2" fill="#ef4444" stroke={strokeColor} strokeWidth="1.5"/>
                <path d="M22 23L28 27L22 31V23Z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
            </FileBase>
          </svg>
        );
    case 'code':
        return (
          <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <FileBase fill="#fef9c3">
                <path d="M18 24L14 28L18 32" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 24L34 28L30 32" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M25 22L23 34" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round"/>
            </FileBase>
          </svg>
        );
    case 'terminal':
        return (
          <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
             <rect x="6" y="10" width="36" height="28" rx="2" fill="#292524" stroke={strokeColor} strokeWidth={strokeWidth} />
             <path d="M6 16H42" stroke={strokeColor} strokeWidth="2" />
             <circle cx="10" cy="13" r="1.5" fill="#ef4444" />
             <circle cx="15" cy="13" r="1.5" fill="#fbbf24" />
             <circle cx="20" cy="13" r="1.5" fill="#22c55e" />
             <path d="M12 24L16 28L12 32" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <line x1="20" y1="32" x2="26" y2="32" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
    case 'archive':
        return (
          <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
             <path d="M10 12H38V40H10V12Z" fill="#d6d3d1" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
             <path d="M8 8H40V14H8V8Z" fill="#a8a29e" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
             <path d="M24 14V30" stroke={strokeColor} strokeWidth="2" strokeDasharray="2 2"/>
             <rect x="20" y="30" width="8" height="6" fill="#78716c" stroke={strokeColor} strokeWidth="1.5"/>
          </svg>
        );
    case 'mail':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="10" width="40" height="28" rx="3" fill="#60a5fa" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
          <path d="M4 10L24 26L44 10" fill="#93c5fd" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      );
    case 'news':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Back Paper */}
          <path d="M10 8H36V40H10V8Z" fill="#fef3c7" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
          {/* Front Fold */}
          <path d="M36 8L42 14V40H36V8Z" fill="#fbbf24" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
          <path d="M36 40H42L36 46V40Z" fill="#d97706" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
          {/* Headline Lines */}
          <rect x="14" y="14" width="18" height="4" fill="#1e293b" />
          <rect x="14" y="22" width="20" height="2" fill="#94a3b8" />
          <rect x="14" y="27" width="20" height="2" fill="#94a3b8" />
          <rect x="14" y="32" width="12" height="2" fill="#94a3b8" />
          {/* Image Placeholder */}
          <rect x="24" y="32" width="10" height="6" fill="#60a5fa" stroke={strokeColor} strokeWidth="1"/>
        </svg>
      );
    case 'trash':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M10 14H38L35 42H13L10 14Z" fill="#9ca3af" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
          <rect x="8" y="10" width="32" height="4" rx="1" fill="#d1d5db" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
          <path d="M18 10V6C18 4.89543 18.8954 4 20 4H28C29.1046 4 30 4.89543 30 6V10" fill="#d1d5db" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
          <path d="M19 20V36" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          <path d="M24 20V36" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          <path d="M29 20V36" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="24" cy="24" r="20" fill="#e5e5e5" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="4 2"/>
            <path d="M16 16L32 32M32 16L16 32" stroke={strokeColor} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
  }
};
