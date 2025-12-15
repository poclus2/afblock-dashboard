import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/api';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate();

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['auth-user'],
        queryFn: AuthService.getProfile,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    useEffect(() => {
        if (isError) {
            navigate('/login');
        }
    }, [isError, navigate]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !user) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
};
