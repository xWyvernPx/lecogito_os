
import { create } from 'zustand';
import { SERIES, BLOG_POSTS, Serie, BlogPost, CATEGORIES, AUTHORS, PostCategory } from './data';

interface BlogState {
    series: Serie[];
    posts: BlogPost[];
    categories: string[];
    authors: string[];
    
    // Actions
    addSeries: (serie: Serie) => void;
    deleteSeries: (id: string) => void;
    
    addPost: (post: BlogPost) => void;
    
    addCategory: (cat: string) => void;
    deleteCategory: (cat: string) => void;
    
    addAuthor: (author: string) => void;
    deleteAuthor: (author: string) => void;
}

export const useBlogStore = create<BlogState>((set) => ({
    series: SERIES,
    posts: BLOG_POSTS,
    categories: CATEGORIES,
    authors: AUTHORS,

    addSeries: (serie) => set((state) => ({ 
        series: [serie, ...state.series] 
    })),

    deleteSeries: (id) => set((state) => ({ 
        series: state.series.filter(s => s.id !== id) 
    })),

    addPost: (post) => set((state) => ({ 
        posts: [post, ...state.posts] 
    })),

    addCategory: (cat) => set((state) => ({
        categories: [...state.categories, cat]
    })),

    deleteCategory: (cat) => set((state) => ({
        categories: state.categories.filter(c => c !== cat)
    })),

    addAuthor: (author) => set((state) => ({
        authors: [...state.authors, author]
    })),

    deleteAuthor: (author) => set((state) => ({
        authors: state.authors.filter(a => a !== author)
    })),
}));
