
import { useMemo } from 'react';
import { BLOG_POSTS } from '../apps/blog/data';
import { APP_PRESETS } from '../../config/apps';
import { LOCAL_FS } from '../../config/terminal';
import { FileSystemNode } from '../../types';

export interface SearchResult {
    id: string;
    title: string;
    description: string;
    type: 'blog' | 'app' | 'project' | 'file';
    path: string; // The "virtual" path displayed
    action: () => void;
}

export const useSearch = (query: string, spawnWindow: (id: string, preset?: any) => void) => {
    
    const results = useMemo(() => {
        if (!query.trim()) return [];
        
        const q = query.toLowerCase();
        const allItems: SearchResult[] = [];

        // 1. Blog Posts
        BLOG_POSTS.forEach(post => {
            allItems.push({
                id: `blog-${post.id}`,
                title: post.title,
                description: post.excerpt,
                type: 'blog',
                path: `/blog/${post.id}-${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                action: () => spawnWindow('blog', { 
                    title: post.title,
                    content: [{ type: 'blog-news', postId: post.id }] 
                })
            });
        });

        // 2. Apps (from Presets)
        Object.entries(APP_PRESETS).forEach(([key, app]) => {
            if (key === 'blog') return; // Handled specifically above
            allItems.push({
                id: `app-${key}`,
                title: app.title.replace('.EXE', '').replace('.MD', ''),
                description: `Launch Application: ${app.title}`,
                type: 'app',
                path: `/applications/${key}`,
                action: () => spawnWindow(key)
            });
        });

        // 3. Projects (Hardcoded for now as useProjects is async, 
        // ideally we would cache this or use sync data if available)
        // MOCK DATA DUPLICATION FOR SYNC SEARCH (In real app, fetch or use store)
        const MOCK_PROJECTS = [
            { id: 1, name: "Pharmacy Inventory System", desc: "System for pharmacy chains." },
            { id: 2, name: "Han Spreadsheet", desc: "Web-based spreadsheet editor." }
        ];
        
        MOCK_PROJECTS.forEach(proj => {
            allItems.push({
                id: `project-${proj.id}`,
                title: proj.name,
                description: proj.desc,
                type: 'project',
                path: `/projects/${proj.id}`,
                action: () => spawnWindow('projects', {
                    title: proj.name,
                    content: [{ type: 'project-detail', projectId: proj.id }]
                })
            });
        });

        // 4. Files (Recursive)
        const traverse = (node: FileSystemNode, currentPath: string) => {
            if (node.children) {
                Object.entries(node.children).forEach(([name, child]) => {
                    const fullPath = `${currentPath}/${name}`;
                    if (child.type === 'file') {
                        allItems.push({
                            id: `file-${fullPath}`,
                            title: name,
                            description: `File located at ~${fullPath}`,
                            type: 'file',
                            path: `~${fullPath}`,
                            action: () => spawnWindow('file-manager', { initialPath: currentPath })
                        });
                    } else {
                        traverse(child, fullPath);
                    }
                });
            }
        };
        traverse(LOCAL_FS, '');

        // Filtering Logic (Simple Fuzzy)
        return allItems.filter(item => {
            return item.title.toLowerCase().includes(q) || 
                   item.description.toLowerCase().includes(q) ||
                   item.path.toLowerCase().includes(q);
        }).sort((a, b) => {
            // Prioritize title match
            const aTitle = a.title.toLowerCase().includes(q);
            const bTitle = b.title.toLowerCase().includes(q);
            if (aTitle && !bTitle) return -1;
            if (!aTitle && bTitle) return 1;
            return 0;
        });

    }, [query, spawnWindow]);

    return results;
};
