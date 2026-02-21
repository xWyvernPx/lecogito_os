import React from 'react';
import { ContentItemProps } from './types';

export const LineRenderer: React.FC<ContentItemProps> = () => {
    return <div className="border-b border-dashed border-os-border opacity-50 my-6" />;
};
