import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlogService, CreateBlogPostPayload, BlogPost } from "@/services/blog-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const CreateEditBlogPostPage = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<CreateBlogPostPayload>({
        title: "",
        slug: "",
        content: "",
        summary: "",
        cover_image_url: "",
        author_name: "",
        status: "DRAFT",
    });

    const { data: existingPost, isLoading: isLoadingPost } = useQuery({
        queryKey: ["blog-post", id],
        queryFn: () => BlogService.getPost(id!),
        enabled: isEditMode,
    });

    useEffect(() => {
        if (existingPost) {
            setFormData({
                title: existingPost.title,
                slug: existingPost.slug,
                content: existingPost.content,
                summary: existingPost.summary || "",
                cover_image_url: existingPost.cover_image_url || "",
                author_name: existingPost.author_name || "",
                status: existingPost.status,
            });
        }
    }, [existingPost]);

    const mutation = useMutation({
        mutationFn: (data: CreateBlogPostPayload) => {
            if (isEditMode) {
                return BlogService.updatePost(id!, data);
            }
            return BlogService.createPost(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            toast({
                title: isEditMode ? "Post updated" : "Post created",
                description: `Blog post has been successfully ${isEditMode ? "updated" : "created"}.`,
            });
            navigate("/blog");
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to save blog post. " + error,
                variant: "destructive",
            });
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Auto-generate slug from title if in create mode and slug hasn't been manually touched (simple heuristic)
            if (name === 'title' && !isEditMode && (!prev.slug || prev.slug === prev.title.toLowerCase().replace(/ /g, '-'))) {
                newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            return newData;
        });
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, status: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (isEditMode && isLoadingPost) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/blog")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? "Edit Blog Post" : "Create New Blog Post"}</h1>
                    <p className="text-muted-foreground mt-1">
                        {isEditMode ? "Update existing article details." : "Write and publish a new article."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Article Details</CardTitle>
                            <CardDescription>Basic information about the blog post.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input required id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter article title" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input required id="slug" name="slug" value={formData.slug} onChange={handleChange} placeholder="article-url-slug" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="author_name">Author Name</Label>
                                    <Input id="author_name" name="author_name" value={formData.author_name} onChange={handleChange} placeholder="John Doe" />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={handleSelectChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                        <SelectItem value="PUBLISHED">Published</SelectItem>
                                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="summary">Summary (Excerpt)</Label>
                                <Textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="Brief summary of the article..." rows={3} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                                <Input id="cover_image_url" name="cover_image_url" value={formData.cover_image_url} onChange={handleChange} placeholder="https://..." />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                            <CardDescription>The main content of the article. Supports HTML/Markdown (depending on frontend implementation).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <Label htmlFor="content">Post Content</Label>
                                <Textarea
                                    required
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your article here..."
                                    className="min-h-[400px] font-mono"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => navigate("/blog")}>Cancel</Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? "Update Post" : "Create Post"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default CreateEditBlogPostPage;
