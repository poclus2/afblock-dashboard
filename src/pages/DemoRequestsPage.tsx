import { useState, useEffect } from 'react';
import { CompanyService, DemoRequest } from '@/services/api';
import { KPICard } from '@/components/dashboard/KPICard';
import { Mail, Phone, Globe, DollarSign, Briefcase } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DemoRequestsPage() {
    const [requests, setRequests] = useState<DemoRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await CompanyService.getDemoRequests();
            // Sort by date desc
            data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setRequests(data);
        } catch (error) {
            console.error('Error fetching demo requests:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Contact Forms</h1>
                <p className="text-muted-foreground">Manage demo requests and inquiries from the showcase site</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard
                    title="Total Requests"
                    value={requests.length.toString()}
                    icon={<Mail className="h-6 w-6" />}
                />
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Enterprise</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Use Case</TableHead>
                            <TableHead>Volume</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No demo requests found
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">
                                        {request.enterprise_name}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                {request.business_email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3 w-3 text-muted-foreground" />
                                                {request.phone_number}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-3 w-3 text-muted-foreground" />
                                            {request.country}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="flex w-fit items-center gap-1">
                                            <Briefcase className="h-3 w-3" />
                                            {request.use_case}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="flex w-fit items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            {request.transaction_volume}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(request.created_at).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
