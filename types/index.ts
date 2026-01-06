export * from "./api"

import { ReactNode } from 'react';

// --- System State ---
export type SystemState = 'booting' | 'login' | 'running' | 'shutdown';
export type Theme = 'bone' | 'night' | 'seraph' | 'gruvbox';
export type Language = 'en' | 'vi'; // Added Language Type

export interface UserProfile {
    id: string;
    name: string;
    avatar: string; // URL
    email?: string;
    type: 'guest' | 'user' | 'admin';
    provider?: 'github' | 'google' | 'email' | 'local';
    password?: string; // For mock auth
}

// --- Icons ---
export type IconType = 'folder' | 'file' | 'mail' | 'trash' | 'news' | 'image' | 'music' | 'video' | 'code' | 'terminal' | 'archive' | 'browser' | 'kanban';

export interface DesktopIconDef {
  id: string;
  label: string;
  type: IconType;
  x: number;
  y: number;
}

// --- Widgets ---
export type WidgetType = 'clock' | 'player';

export interface WidgetDef {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  isOpen: boolean;
}

// --- Context Menu ---
export type ContextMenuType = 'desktop' | 'icon' | null;

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  type: ContextMenuType;
  targetId?: string;
}

// --- Calendar ---
export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'work' | 'personal' | 'reminder';
    description?: string;
}

// --- Window Content Types ---
export type ContentType = 'h1' | 'h2' | 'p' | 'list' | 'table' | 'line' | 'button' | 'spacer' | 'terminal' | 'image' | 'collage' | 'stats' | 'image-generator' | 'hero' | 'quest-log' | 'widget-selector' | 'project-list' | 'project-detail' | 'blog-news' | 'conspiracy-map' | 'event-editor' | 'resume-viewer' | 'pixel-paint' | 'display-settings' | 'system-monitor' | 'file-manager' | 'chatbot' | 'video-player' | 'browser' | 'app-creator' | 'kanban-board';

export interface TableHeader {
  text: string;
  width: string;
}

export interface TagCell {
  type: 'tags';
  tags: string[];
}

export interface LinkCell {
  type: 'link';
  text: string;
  action?: string;
  url?: string;
}

export interface IconCell {
  type: 'icon';
  src: string;
  alt?: string;
}

export type TableCell = string | TagCell | LinkCell | IconCell;

export interface StatItem {
  label: string;
  value: number; // 0 to 100
  color?: string;
}

export interface QuestItem {
  title: string;
  organization: string;
  period: string;
  description: string;
  image?: string;
  tags?: string[];
  status: 'active' | 'completed';
}

export interface ContentItem {
  type: ContentType;
  text?: string;
  sub?: string; // For H1
  headers?: TableHeader[]; // For Table
  rows?: TableCell[][]; // For Table
  stats?: StatItem[]; // For Stats
  quests?: QuestItem[]; // For Quest Log
  action?: string; // For Button or internal Link
  link?: string; // For External Links
  src?: string; // For Images or Iframe URL
  secondarySrc?: string; // For Collage or Hero Character
  height?: number | string; // For Spacer or Image height
  alt?: string;
  projectId?: number; // For Project Detail
  initialPath?: string; // For File Manager
  postId?: string; // For Blog
  view?: string; // For Blog
}

// --- Window Definition ---

export interface WindowHistoryItem {
    title: string;
    content: ContentItem[];
}

export interface WindowDef {
  id: string;
  title: string; // Current title displayed
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  isActive: boolean;
  isMinimized: boolean;
  isMaximized: boolean; // New: Fullscreen support
  workspace: number;
  
  // Navigation State
  history: WindowHistoryItem[];
  historyIndex: number;
}

// --- Menu Types ---
export interface SubMenuItem {
  label: string;
  icon?: ReactNode;
  shortcut?: string[];
  onClick?: () => void;
  danger?: boolean;
}

export interface MenuItemDef {
  label: string;
  icon?: ReactNode;
  subItems?: SubMenuItem[];
  shortcut?: string[];
  onClick?: () => void;
  danger?: boolean;
}

// --- Terminal & System Config Types ---

export interface FileSystemNode {
    type: 'file' | 'dir';
    content?: string; // content for text files
    appId?: string; // ID of the app to launch (for .exe)
    src?: string; // URL for media files or remote apps
    children?: { [key: string]: FileSystemNode }; // children for dirs
}

export interface BootSequenceItem {
    text: string;
    delay: number;
}
