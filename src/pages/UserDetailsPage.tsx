import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    UserIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    NoSymbolIcon,
    BanknotesIcon,
    TrashIcon,
    PencilSquareIcon,
    ClockIcon,
    DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { BusinessUserService, ComplianceService } from '../services/api';
import EditUserProfileModal from '../components/users/EditUserProfileModal';
import { AddFundModal } from '../components/users/AddFundModal';
import { toast } from 'react-hot-toast';

export default function UserDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [kybHistory, setKybHistory] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('transactions'); // transactions, activity, kyb
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddFundModalOpen, setIsAddFundModalOpen] = useState(false);

    // Helpers to display status badges
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'APPROVED': 'bg-green-100 text-green-800',
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'UNDER_REVIEW': 'bg-blue-100 text-blue-800',
            'REJECTED': 'bg-red-100 text-red-800',
            'ONBOARDING': 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const fetchData = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const userData = await BusinessUserService.getBusinessUser(id);
            setUser(userData);

            // Parallel fetches for tables
            const history = await BusinessUserService.getKybHistory(id);
            setKybHistory(history);

            const activityData = await BusinessUserService.getUserActivity(id);
            setActivity(activityData);

        } catch (error) {
            console.error('Failed to fetch user details', error);
            toast.error('Erreur lors du chargement des détails utilisateur');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleApproveKyb = async () => {
        if (!user?.enterprise?.id) return;
        if (!confirm('Êtes-vous sûr de vouloir approuver ce KYB ?')) return;
        try {
            await ComplianceService.approveKyb(user.enterprise.id);
            toast.success('KYB Approuvé avec succès');
            fetchData();
        } catch (error) {
            toast.error('Erreur lors de l\'approbation');
        }
    };

    const handleRejectKyb = async () => {
        if (!user?.enterprise?.id) return;
        const reason = prompt('Raison du rejet :');
        if (!reason) return;
        try {
            await ComplianceService.rejectKyb(user.enterprise.id, reason);
            toast.success('KYB Rejeté');
            fetchData();
        } catch (error) {
            toast.error('Erreur lors du rejet');
        }
    };

    const handleToggleBlock = async () => {
        if (!id) return;
        if (!confirm(user.is_blocked ? 'Débloquer cet utilisateur ?' : 'Bloquer cet utilisateur ?')) return;
        try {
            await BusinessUserService.toggleBlockUser(id);
            toast.success(user.is_blocked ? 'Utilisateur débloqué' : 'Utilisateur bloqué');
            fetchData();
        } catch (error) {
            toast.error('Erreur lors du blocage/déblocage');
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (!confirm('ATTENTION: Cette action est irréversible. Voulez-vous vraiment supprimer cet utilisateur ?')) return;
        try {
            await BusinessUserService.deleteBusinessUser(id);
            toast.success('Utilisateur supprimé');
            navigate('/users');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleUpdateProfile = async (data: any) => {
        if (!id) return;
        await BusinessUserService.updateBusinessUserProfile(id, data);
        toast.success('Profil mis à jour');
        fetchData();
    };

    if (isLoading) return <div className="p-8 text-center">Chargement...</div>;
    if (!user) return <div className="p-8 text-center">Utilisateur non trouvé</div>;

    return (
        <div className="space-y-6">
            {/* Header / Back */}
            <div className="flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" /> Retour
                </button>
            </div>

            {/* User Info Card */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 rounded-full p-4">
                            <span className="text-xl font-bold text-blue-600">
                                {user.enterprise?.company_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {user.enterprise?.company_name || 'Particulier'}
                            </h1>
                            <div className="flex items-center text-sm text-gray-500 space-x-4 mt-1">
                                <span className="flex items-center">
                                    <UserIcon className="h-4 w-4 mr-1" /> {user.email}
                                </span>
                                <span>ID: {user.id}</span>
                                <span>Inscrit le {new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end mt-4 md:mt-0 space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">KYC/KYB:</span>
                            {getStatusBadge(user.enterprise?.status || 'UNKNOWN')}
                        </div>
                        {user.is_blocked && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                BLOQUÉ
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
                    {/* KYB Actions */}
                    {user.enterprise?.status === 'UNDER_REVIEW' && (
                        <button onClick={handleApproveKyb} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                            <CheckCircleIcon className="h-4 w-4 mr-2" /> Approuver KYB
                        </button>
                    )}

                    {/* Always show Reject/Suspend if not already rejected? Or only if active/pending. 
                         Let's allow suspending an approved acct too. */}
                    {user.enterprise?.status !== 'REJECTED' && (
                        <button onClick={handleRejectKyb} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <NoSymbolIcon className="h-4 w-4 mr-2" /> {user.enterprise?.status === 'APPROVED' ? 'Suspendre KYB' : 'Rejeter KYB'}
                        </button>
                    )}

                    <button onClick={() => setIsAddFundModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <BanknotesIcon className="h-4 w-4 mr-2" /> Créditer Wallet
                    </button>

                    <button onClick={handleToggleBlock} className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${user.is_blocked ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}>
                        <NoSymbolIcon className="h-4 w-4 mr-2" /> {user.is_blocked ? 'Débloquer' : 'Bloquer'}
                    </button>

                    <div className="flex-grow"></div>

                    <button onClick={() => setIsEditModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <PencilSquareIcon className="h-4 w-4 mr-2" /> Modifier
                    </button>

                    <button onClick={handleDelete} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50">
                        <TrashIcon className="h-4 w-4 mr-2" /> Supprimer
                    </button>
                </div>
            </div>

            {/* Wallet & Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Solde USD (Ledger)</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">${user.balance?.toLocaleString() || '0.00'}</dd>
                    </div>
                </div>
                {/* Additional Stats can be added here */}
            </div>

            {/* Tabs */}
            <div className="bg-white shadow rounded-lg overflow-hidden min-h-[400px]">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('transactions')}
                            className={`${activeTab === 'transactions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                        >
                            Transactions
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`${activeTab === 'activity' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                        >
                            Activité
                        </button>
                        <button
                            onClick={() => setActiveTab('kyb')}
                            className={`${activeTab === 'kyb' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                        >
                            Historique KYB
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {/* Transactions Tab Content */}
                    {activeTab === 'transactions' && (
                        <div>
                            <p className="text-gray-500 text-sm mb-4">Historique des transactions (Implémentation à venir - Voir LedgerService)</p>
                            {/* Placeholder for now */}
                            <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
                                Aucune transaction récente ou fonctionnalité en cours de développement.
                            </div>
                        </div>
                    )}

                    {/* Activity Tab Content */}
                    {activeTab === 'activity' && (
                        <div className="flow-root">
                            <ul role="list" className="-mb-8">
                                {activity.map((event, eventIdx) => (
                                    <li key={event.id}>
                                        <div className="relative pb-8">
                                            {eventIdx !== activity.length - 1 ? (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${event.type === 'SECURITY' ? 'bg-red-500' : 'bg-gray-400'}`}>
                                                        {event.type === 'SECURITY' ? <NoSymbolIcon className="h-5 w-5 text-white" /> : <ClockIcon className="h-5 w-5 text-white" />}
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">{event.title} <span className="font-medium text-gray-900">{event.message}</span></p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        <time dateTime={event.created_at}>{new Date(event.created_at).toLocaleString()}</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                {activity.length === 0 && <p className="text-gray-500">Aucune activité enregistrée.</p>}
                            </ul>
                        </div>
                    )}

                    {/* KYB History Tab Content */}
                    {activeTab === 'kyb' && (
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Raison (si rejet)</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Données</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {kybHistory.map((item) => (
                                        <tr key={item.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{new Date(item.created_at).toLocaleString()}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.rejection_reason || '-'}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-600 hover:text-blue-900 cursor-pointer">
                                                <DocumentMagnifyingGlassIcon className="h-5 w-5" title="Voir Snapshot" />
                                            </td>
                                        </tr>
                                    ))}
                                    {kybHistory.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-4 text-sm text-gray-500">Aucun historique disponible.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <EditUserProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onSave={handleUpdateProfile}
            />
            {user && (
                <AddFundModal
                    isOpen={isAddFundModalOpen}
                    onClose={() => setIsAddFundModalOpen(false)}
                    userId={user.id}
                    userName={user.enterprise?.company_name || user.email}
                    onSuccess={fetchData}
                />
            )}
        </div>
    );
}
