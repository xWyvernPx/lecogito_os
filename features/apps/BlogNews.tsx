
import React, { useState, useEffect } from 'react';
import { BlogHome } from './blog/BlogHome';
import { BlogArchive } from './blog/BlogArchive';
import { BlogEditor } from './blog/BlogEditor';
import { BlogDetail } from './blog/BlogDetail';
import { BlogSettings } from './blog/BlogSettings';
import { BlogPost, BLOG_POSTS } from './blog/data';
import { WindowDef, ContentItem } from '../../types';

interface BlogNewsProps {
    win: WindowDef;
    contentItem: ContentItem;
}

// Extend ContentItem type locally if needed or rely on loose typing
interface BlogContentItem extends ContentItem {
    postId?: string;
    view?: 'HOME' | 'ARCHIVE' | 'EDITOR';
}

type ViewState = 'HOME' | 'ARCHIVE' | 'EDITOR' | 'READ' | 'SETTINGS';

export const BlogNews: React.FC<BlogNewsProps> = ({ contentItem }) => {
    const item = contentItem as BlogContentItem;
    
    const [view, setView] = useState<ViewState>('HOME');
    const [activePost, setActivePost] = useState<BlogPost | null>(null);

    // Deep Linking Handler
    useEffect(() => {
        if (item.postId) {
            const post = BLOG_POSTS.find(p => p.id === item.postId);
            if (post) {
                setActivePost(post);
                setView('READ');
            }
        } else if (item.view) {
            setView(item.view);
        }
    }, [item.postId, item.view]);

    const handleReadPost = (post: BlogPost) => {
        setActivePost(post);
        setView('READ');
    };

    if (view === 'EDITOR') {
        return (
            <BlogEditor 
                onCancel={() => setView('ARCHIVE')} 
                onPublish={() => {
                    setView('HOME');
                }} 
            />
        );
    }

    if (view === 'SETTINGS') {
        return (
            <BlogSettings 
                onBack={() => setView('ARCHIVE')} 
            />
        );
    }

    if (view === 'ARCHIVE') {
        return (
            <BlogArchive 
                onBack={() => setView('HOME')} 
                onCompose={() => setView('EDITOR')}
                onSettings={() => setView('SETTINGS')}
                onPostClick={handleReadPost}
            />
        );
    }

    if (view === 'READ' && activePost) {
        return (
            <BlogDetail 
                post={activePost} 
                onBack={() => setView('ARCHIVE')} 
            />
        );
    }

    return (
        <BlogHome 
            onNavigateToArchive={() => setView('ARCHIVE')} 
            onPostClick={handleReadPost}
        />
    );
};
