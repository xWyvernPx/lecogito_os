/**
 * Obsidian-compatible callout configuration.
 * Maps callout types (e.g. `[!info]`, `[!warning]`) to their visual config.
 */
import {
    Pencil,
    ClipboardList,
    Info,
    CheckCircle2,
    Lightbulb,
    HelpCircle,
    AlertTriangle,
    Zap,
    XCircle,
    Bug,
    Hash,
    Quote,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CalloutDef {
    icon: LucideIcon;
    color: string;
    bg: string;
    border: string;
    label: string;
    iconColor: string;
}

export const CALLOUT_CONFIG: Record<string, CalloutDef> = {
    note: {
        icon: Pencil,
        color: 'text-[#086ddd]',
        bg: 'bg-[#f0f7ff]',
        border: 'border-[#086ddd]',
        label: 'Note',
        iconColor: '#086ddd',
    },
    abstract: {
        icon: ClipboardList,
        color: 'text-[#00a8a8]',
        bg: 'bg-[#f0ffff]',
        border: 'border-[#00a8a8]',
        label: 'Abstract',
        iconColor: '#00a8a8',
    },
    info: {
        icon: Info,
        color: 'text-[#086ddd]',
        bg: 'bg-[#f0f7ff]',
        border: 'border-[#086ddd]',
        label: 'Info',
        iconColor: '#086ddd',
    },
    todo: {
        icon: CheckCircle2,
        color: 'text-[#086ddd]',
        bg: 'bg-[#f0f7ff]',
        border: 'border-[#086ddd]',
        label: 'Todo',
        iconColor: '#086ddd',
    },
    tip: {
        icon: Lightbulb,
        color: 'text-[#00a870]',
        bg: 'bg-[#f0fff4]',
        border: 'border-[#00a870]',
        label: 'Tip',
        iconColor: '#00a870',
    },
    success: {
        icon: CheckCircle2,
        color: 'text-[#00a870]',
        bg: 'bg-[#f0fff4]',
        border: 'border-[#00a870]',
        label: 'Success',
        iconColor: '#00a870',
    },
    question: {
        icon: HelpCircle,
        color: 'text-[#d86b00]',
        bg: 'bg-[#fff9f0]',
        border: 'border-[#d86b00]',
        label: 'Question',
        iconColor: '#d86b00',
    },
    warning: {
        icon: AlertTriangle,
        color: 'text-[#d86b00]',
        bg: 'bg-[#fff9f0]',
        border: 'border-[#d86b00]',
        label: 'Warning',
        iconColor: '#d86b00',
    },
    failure: {
        icon: XCircle,
        color: 'text-[#e93d3d]',
        bg: 'bg-[#fff5f5]',
        border: 'border-[#e93d3d]',
        label: 'Failure',
        iconColor: '#e93d3d',
    },
    danger: {
        icon: Zap,
        color: 'text-[#e93d3d]',
        bg: 'bg-[#fff5f5]',
        border: 'border-[#e93d3d]',
        label: 'Danger',
        iconColor: '#e93d3d',
    },
    bug: {
        icon: Bug,
        color: 'text-[#e93d3d]',
        bg: 'bg-[#fff5f5]',
        border: 'border-[#e93d3d]',
        label: 'Bug',
        iconColor: '#e93d3d',
    },
    example: {
        icon: Hash,
        color: 'text-[#785ad0]',
        bg: 'bg-[#f7f5ff]',
        border: 'border-[#785ad0]',
        label: 'Example',
        iconColor: '#785ad0',
    },
    quote: {
        icon: Quote,
        color: 'text-[#666666]',
        bg: 'bg-[#f8f8f8]',
        border: 'border-[#666666]',
        label: 'Quote',
        iconColor: '#666666',
    },
};
