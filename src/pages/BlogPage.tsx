import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogService, BlogPost } from "@/services/blog-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, Globe, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

const BlogPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: posts, isLoading } = useQuery({
        queryKey: ["blog-posts"],
        queryFn: () => BlogService.getAllPosts(),
    });

    const deleteMutation = useMutation({
        mutationFn: BlogService.deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            toast({
                title: "Post deleted",
                description: "The blog post has been successfully deleted.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete the blog post.",
                variant: "destructive",
            });
        }
    });

    const filteredPosts = posts?.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>;
            case 'DRAFT':
                return <Badge variant="secondary">Draft</Badge>;
            case 'ARCHIVED':
                return <Badge variant="outline">Archived</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
                    <p className="text-muted-foreground mt-1">Create and manage your blog articles.</p>
                </div>
                <Button onClick={() => navigate("/blog/create")} className="gap-2">
                    <Plus className="h-4 w-4" /> Create New Post
                </Button>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Published At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">Loading posts...</TableCell>
                            </TableRow>
                        ) : filteredPosts?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No posts found. Create your first blog post!
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPosts?.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{post.title}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{post.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{post.author_name || 'Unknown'}</TableCell>
                                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                                    <TableCell>{format(new Date(post.created_at), 'PPP')}</TableCell>
                                    <TableCell>{post.published_at ? format(new Date(post.published_at), 'PPP') : '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Preview Link (Mocking external link) */}
                                            <Button variant="ghost" size="icon" asChild>
                                                <a href="#" target="_blank" rel="noopener noreferrer" title="View on Site">
                                                    <Globe className="h-4 w-4" />
                                                </a>
                                            </Button>

                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/blog/edit/${post.id}`)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the blog post "{post.title}".
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteMutation.mutate(post.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default BlogPage;
