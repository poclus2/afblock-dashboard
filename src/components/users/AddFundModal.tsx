import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminWalletService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface AddFundModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number | string;
    userName: string;
}

export function AddFundModal({ isOpen, onClose, userId, userName }: AddFundModalProps) {
    const [amount, setAmount] = useState('');
    const [currencyId, setCurrencyId] = useState('1'); // Default to USDT (1)
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleCredit = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid positive number.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            await AdminWalletService.creditWallet(userId, Number(currencyId), Number(amount));
            toast({
                title: "Success",
                description: `Successfully credited ${amount} to ${userName}.`,
            });
            onClose();
            setAmount('');
        } catch (error) {
            console.error('Error crediting wallet:', error);
            toast({
                title: "Error",
                description: "Failed to credit wallet. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Funds to {userName}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currency" className="text-right">
                            Currency
                        </Label>
                        <Select value={currencyId} onValueChange={setCurrencyId}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">USDT</SelectItem>
                                <SelectItem value="2">USDC</SelectItem>
                                <SelectItem value="3">XAF</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button onClick={handleCredit} disabled={loading}>
                        {loading ? 'Processing...' : 'Add Funds'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
