import React from 'react';
import { ContentItemProps } from './types';

export const SpacerRenderer: React.FC<ContentItemProps> = ({ item }) => {
    return <div style={{ height: item.height }} />;
};
