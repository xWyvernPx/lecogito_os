import React from 'react';
import { ContentType } from '@/types';
import { ContentItemProps } from './types';
import { HeroRenderer } from './HeroRenderer';
import { QuestLogRenderer } from './QuestLogRenderer';
import { CollageRenderer } from './CollageRenderer';
import { StatsRenderer } from './StatsRenderer';
import { ImageRenderer } from './ImageRenderer';
import { H1Renderer } from './H1Renderer';
import { TableRenderer } from './TableRenderer';
import { H2Renderer } from './H2Renderer';
import { ListItemRenderer } from './ListItemRenderer';
import { ButtonRenderer } from './ButtonRenderer';
import { SpacerRenderer } from './SpacerRenderer';
import { LineRenderer } from './LineRenderer';
import { ParagraphRenderer } from './ParagraphRenderer';

export type { ContentItemProps };

export const PRIMITIVE_RENDERERS: Partial<Record<ContentType, React.FC<ContentItemProps>>> = {
    'hero': HeroRenderer,
    'quest-log': QuestLogRenderer,
    'collage': CollageRenderer,
    'stats': StatsRenderer,
    'image': ImageRenderer,
    'h1': H1Renderer,
    'table': TableRenderer,
    'h2': H2Renderer,
    'list': ListItemRenderer,
    'button': ButtonRenderer,
    'spacer': SpacerRenderer,
    'line': LineRenderer,
    'p': ParagraphRenderer,
};

export { ParagraphRenderer };
