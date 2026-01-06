import { api } from './api';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    summary?: string;
    cover_image_url?: string;
    author_name?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    published_at?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateBlogPostPayload {
    title: string;
    slug: string;
    content: string;
    summary?: string;
    cover_image_url?: string;
    author_name?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface UpdateBlogPostPayload {
    title?: string;
    slug?: string;
    content?: string;
    summary?: string;
    cover_image_url?: string;
    author_name?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export const BlogService = {
    getAllPosts: async (status?: string): Promise<BlogPost[]> => {
        const params = status ? { status } : {};
        const response = await api.get('/blog/admin/posts', { params });
        return response.data;
    },
    getPost: async (id: string): Promise<BlogPost> => {
        const response = await api.get(`/blog/admin/posts/${id}`);
        return response.data;
    },
    createPost: async (data: CreateBlogPostPayload): Promise<BlogPost> => {
        const response = await api.post('/blog', data);
        return response.data;
    },
    updatePost: async (id: string, data: UpdateBlogPostPayload): Promise<BlogPost> => {
        const response = await api.patch(`/blog/${id}`, data);
        return response.data;
    },
    deletePost: async (id: string): Promise<void> => {
        await api.delete(`/blog/${id}`);
    }
};
