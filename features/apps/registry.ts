
import React, { lazy } from 'react';
import { WindowDef, ContentItem } from '../../types';

export interface AppProps {
  win: WindowDef;
  contentItem: ContentItem;
}

export interface AppDefinition {
  component: React.ComponentType<AppProps>;
  // Flags to control window behavior
  hideToolbar?: boolean;
  noPadding?: boolean;
}

// Helper to handle named exports with React.lazy
const loadApp = (importFn: () => Promise<any>, name: string) => {
  return lazy(() => importFn().then(module => ({ default: module[name] })));
};

export const APP_REGISTRY: Record<string, AppDefinition> = {
  'terminal': {
    component: loadApp(() => import('./Terminal'), 'Terminal'),
    hideToolbar: true,
    noPadding: true
  },
  'image-generator': {
    component: loadApp(() => import('./ImageGenerator'), 'ImageGenerator'),
  },
  'project-list': {
    component: loadApp(() => import('./ProjectList'), 'ProjectList'),
  },
  'project-detail': {
    component: loadApp(() => import('./ProjectDetail'), 'ProjectDetail'),
    hideToolbar: true,
    noPadding: true
  },
  'widget-selector': {
    component: loadApp(() => import('./WidgetSelector'), 'WidgetSelector'),
  },
  'display-settings': {
    component: loadApp(() => import('./DisplaySettings'), 'DisplaySettings'),
    hideToolbar: true,
    noPadding: true
  },
  'blog-news': {
      component: loadApp(() => import('./BlogNews'), 'BlogNews'),
      hideToolbar: true,
      noPadding: true
  },
  'conspiracy-map': {
      component: loadApp(() => import('./ConspiracyMap'), 'ConspiracyMap'),
      hideToolbar: false,
      noPadding: true
  },
  'event-editor': {
      component: loadApp(() => import('./EventEditor'), 'EventEditor'),
      hideToolbar: true, // Custom toolbar inside the component
      noPadding: true
  },
  'resume-viewer': {
      component: loadApp(() => import('./ResumeViewer'), 'ResumeViewer'),
      hideToolbar: true,
      noPadding: true
  },
  'pixel-paint': {
      component: loadApp(() => import('./PixelPaint'), 'PixelPaint'),
      hideToolbar: true,
      noPadding: true
  },
  'system-monitor': {
      component: loadApp(() => import('./SystemMonitor'), 'SystemMonitor'),
      hideToolbar: true,
      noPadding: true
  },
  'file-manager': {
      component: loadApp(() => import('./FileManager'), 'FileManager'),
      hideToolbar: true,
      noPadding: true
  },
  'chatbot': {
      component: loadApp(() => import('./Chatbot'), 'Chatbot'),
      hideToolbar: false,
      noPadding: true
  },
  'video-player': {
      component: loadApp(() => import('./VideoPlayer'), 'VideoPlayer'),
      hideToolbar: true,
      noPadding: true
  },
  'browser': {
      component: loadApp(() => import('./Browser'), 'Browser'),
      hideToolbar: true, // Browser has its own toolbar
      noPadding: true
  },
  'app-creator': {
      component: loadApp(() => import('./AppCreator'), 'AppCreator'),
      hideToolbar: true,
      noPadding: true
  },
  'kanban-board': {
      component: loadApp(() => import('./KanbanBoard'), 'KanbanBoard'),
      hideToolbar: true,
      noPadding: true
  }
};

export const getAppDefinition = (type: string): AppDefinition | undefined => {
  return APP_REGISTRY[type];
};
