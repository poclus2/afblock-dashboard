import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  DollarSign,
  Bitcoin,
  Shield,
  Bell,
  Save,
  UserPlus,
  Globe,
  MapPin,
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Mail,
  MessageSquare
} from 'lucide-react';
import { RegistrationConfigService, RegistrationConfig, Country, City, Gender, FeeService, FiatFee, NotificationService, NotificationProvider, ConversionRate, Currency, CurrencyService } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  console.log('SettingsPage: Rendering started');
  const [registrationConfig, setRegistrationConfig] = useState<RegistrationConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [fees, setFees] = useState<FiatFee[]>([]);
  const [loadingFees, setLoadingFees] = useState(false);
  const [rates, setRates] = useState<ConversionRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [rateValues, setRateValues] = useState<Record<number, { rate: string, fee: string }>>({});

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);

  console.log('SettingsPage: States initialized');


  // Edit states
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [editingGender, setEditingGender] = useState<Gender | null>(null);

  // New item states
  const [newCountry, setNewCountry] = useState({ name: '', code: '' });
  const [newCity, setNewCity] = useState({ name: '', countryId: 0 });
  const [newGender, setNewGender] = useState({ name: '' });
  const [showNewCountry, setShowNewCountry] = useState(false);
  const [showNewCity, setShowNewCity] = useState(false);
  const [showNewGender, setShowNewGender] = useState(false);

  const fetchRegistrationConfig = async () => {
    setLoadingConfig(true);
    try {
      const data = await RegistrationConfigService.getConfig();
      setRegistrationConfig(data);
    } catch (error) {
      console.error('Error fetching registration config:', error);
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setLoadingFees(true);
    try {
      const data = await FeeService.getFees();
      setFees(data);
    } catch (error) {
      console.error('Error fetching fees:', error);
      toast({ title: 'Error', description: 'Failed to load fees', variant: 'destructive' });
    } finally {
      setLoadingFees(false);
    }
  };

  const handleUpdateFee = async (id: number, rate: number) => {
    try {
      await FeeService.updateFee(id, rate);
      toast({ title: 'Fee updated', description: 'Fee rate updated successfully' });
      fetchFees();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update fee', variant: 'destructive' });
    }
  };

  const fetchRates = async () => {
    setLoadingRates(true);
    try {
      const data = await FeeService.getConversionRates();
      // Use optional chaining just in case backend returns unexpected structure
      const validData = Array.isArray(data) ? data : [];
      setRates(validData);

      const initialValues: Record<number, { rate: string, fee: string }> = {};
      validData.forEach(r => {
        initialValues[r.id] = {
          rate: r.rate.toString(),
          fee: (Number(r.fee_percent) * 100).toString() // 0.015 -> 1.5
        };
      });
      setRateValues(initialValues);

    } catch (error) {
      console.error('Error fetching rates:', error);
      toast({ title: 'Error', description: 'Failed to load conversion rates', variant: 'destructive' });
    } finally {
      setLoadingRates(false);
    }
  };

  const handleSaveRates = async () => {
    setLoadingRates(true);
    try {
      await Promise.all(rates.map(async (rate) => {
        const values = rateValues[rate.id];
        if (values) {
          const newRate = parseFloat(values.rate);
          const newFeePercent = parseFloat(values.fee) / 100;

          // Simple check if actually changed could be added
          if (!isNaN(newRate) && !isNaN(newFeePercent)) {
            await FeeService.updateConversionRate(rate.id, newRate, newFeePercent);
          }
        }
      }));
      toast({ title: 'Success', description: 'Conversion rates updated' });
      fetchRates();
    } catch (error) {
      console.error('Error saving rates:', error);
      toast({ title: 'Error', description: 'Failed to save rates', variant: 'destructive' });
    } finally {
      setLoadingRates(false);
    }
  };

  // Country handlers
  const handleCreateCountry = async () => {
    if (!newCountry.name || !newCountry.code) return;
    try {
      await RegistrationConfigService.createCountry(newCountry.name, newCountry.code);
      toast({ title: 'Country created', description: `${newCountry.name} added successfully` });
      setNewCountry({ name: '', code: '' });
      setShowNewCountry(false);
      fetchRegistrationConfig();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create country', variant: 'destructive' });
    }
  };

  const handleUpdateCountry = async () => {
    if (!editingCountry) return;
    try {
      await RegistrationConfigService.updateCountry(editingCountry.id, editingCountry.name, editingCountry.code);
      toast({ title: 'Country updated', description: `${editingCountry.name} updated successfully` });
      setEditingCountry(null);
      fetchRegistrationConfig();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update country', variant: 'destructive' });
    }
  };

  const handleDeleteCountry = async (id: number) => {
    try {
      await RegistrationConfigService.deleteCountry(id);
      toast({ title: 'Country deleted' });
      fetchRegistrationConfig();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete country', variant: 'destructive' });
    }
  };

  // City handlers
  const handleCreateCity = async () => {
    if (!newCity.name || !newCity.countryId) return;
    try {
      await RegistrationConfigService.createCity(newCity.name, newCity.countryId);
      toast({ title: 'City created', description: `${newCity.name} added successfully` });
      setNewCity({ name: '', countryId: 0 });
      setShowNewCity(false);
      fetchRegistrationConfig();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create city', variant: 'destructive' });
    }
  };

  const handleUpdateCity = async () => {
    if (!editingCity) return;
    try {
      await RegistrationConfigService.updateCity(editingCity.id, editingCity.name, editingCity.country?.id || 0);
      toast({ title: 'City updated', description: `${editingCity.name} updated successfully` });
      setEditingCity(null);
      fetchRegistrationConfig();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update city', variant: 'destructive' });
    }
  };

  const handleDeleteCity = async (id: number) => {
    try {
      await RegistrationConfigService.deleteCity(id);
      toast({ title: 'City deleted' });
      fetchRegistrationConfig();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete city', variant: 'destructive' });
    }
  };

  // Gender handlers
  const handleCreateGender = async () => {
    if (!newGender.name) return;
    try {
      await RegistrationConfigService.createGender(newGender.name);
      toast({ title: 'Gender created', description: `${newGender.name} added successfully` });
      setNewGender({ name: '' });
      setShowNewGender(false);
      fetchRegistrationConfig();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create gender', variant: 'destructive' });
    }
  };

  const handleUpdateGender = async () => {
    if (!editingGender) return;
    try {
      await RegistrationConfigService.updateGender(editingGender.id, editingGender.name);
      toast({ title: 'Gender updated', description: `${editingGender.name} updated successfully` });
      setEditingGender(null);
      fetchRegistrationConfig();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update gender', variant: 'destructive' });
    }
  };

  const handleDeleteGender = async (id: number) => {
    try {
      await RegistrationConfigService.deleteGender(id);
      toast({ title: 'Gender deleted' });
      fetchRegistrationConfig();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete gender', variant: 'destructive' });
    }
  };

  const [feeValues, setFeeValues] = useState<Record<number, string>>({});

  useEffect(() => {
    if (fees.length > 0) {
      const initialValues: Record<number, string> = {};
      fees.forEach(f => {
        // Initialize if not already set or preserve edits? 
        // Better to sync with fetched data unless dirty. For now simpler to just sync.
        initialValues[f.id] = (Number(f.rate) * 100).toString(); // Convert 0.015 to 1.5
      });
      setFeeValues(prev => ({ ...initialValues, ...prev })); // Merge to keep edits if re-fetch happens? actually fetch replaces.
      // Let's just reset on fetch.
      setFeeValues(initialValues);
    }
  }, [fees]);

  const handleSaveFees = async () => {
    setLoadingFees(true);
    try {
      await Promise.all(fees.map(async (fee) => {
        const valStr = feeValues[fee.id];
        if (valStr !== undefined) {
          const val = parseFloat(valStr);
          if (!isNaN(val)) {
            // Check if changed? 
            const currentRate = Number(fee.rate);
            const newRate = val / 100;
            if (Math.abs(currentRate - newRate) > 0.000001) {
              await FeeService.updateFee(fee.id, newRate);
            }
          }
        }
      }));
      toast({ title: 'Success', description: 'Fees updated successfully' });
      fetchFees(); // Refresh to confirm
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to update all fees', variant: 'destructive' });
      setLoadingFees(false);
    }
  };

  // Notification States
  const [notificationProviders, setNotificationProviders] = useState<NotificationProvider[]>([]);
  const [editingProvider, setEditingProvider] = useState<NotificationProvider | null>(null);

  const [providerCredentialsJson, setProviderCredentialsJson] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  const fetchNotificationProviders = async () => {
    try {
      console.log('=== FETCH NOTIFICATION PROVIDERS START ===');
      console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:3000');
      console.log('Calling NotificationService.getProviders()...');
      const data = await NotificationService.getProviders();
      console.log('=== RESPONSE RECEIVED ===');
      console.log('Data:', JSON.stringify(data, null, 2));
      console.log('Data is array:', Array.isArray(data));
      console.log('Data length:', data?.length);
      setNotificationProviders(data);
      console.log('State updated successfully');
    } catch (error: any) {
      console.error("=== FETCH ERROR ===");
      console.error("Error object:", error);
      console.error("Error message:", error?.message);
      console.error("Error response:", error?.response);
      console.error("Error response status:", error?.response?.status);
      console.error("Error response data:", error?.response?.data);
      toast({ title: 'Error', description: `Failed to fetch providers: ${error?.message || 'Unknown error'}`, variant: 'destructive' });
    }
  };

  const handleEditProvider = (provider: NotificationProvider) => {
    setEditingProvider(provider);
    setProviderCredentialsJson(JSON.stringify(provider.credentials || {}, null, 2));
    setTestEmail('');
  };

  const handleSaveProvider = async () => {
    if (!editingProvider) return;
    try {
      let credentials;
      try {
        credentials = JSON.parse(providerCredentialsJson);
      } catch (e) {
        toast({ title: 'Invalid JSON', description: 'Please check the credentials format', variant: 'destructive' });
        return;
      }

      await NotificationService.updateProvider(editingProvider.id, {
        credentials,
        isActive: editingProvider.isActive,
        rateLimit: editingProvider.rateLimit
      });
      toast({ title: 'Provider updated', description: 'Configuration saved successfully' });
      setEditingProvider(null);
      fetchNotificationProviders();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save provider', variant: 'destructive' });
    }
  };

  const handleToggleProvider = async (id: number) => {
    try {
      await NotificationService.toggleProvider(id);
      toast({ title: 'Provider status updated' });
      fetchNotificationProviders();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to toggle provider', variant: 'destructive' });
    }
  };

  const handleSendTestEmail = async () => {
    if (!editingProvider || !testEmail) return;
    setSendingTest(true);
    try {
      await NotificationService.sendTest(editingProvider.id, testEmail);
      toast({ title: 'Test Email Sent', description: `Check ${testEmail} inbox.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send test email', variant: 'destructive' });
    } finally {
      setSendingTest(false);
    }
  };

  // Mass Push States
  const [pushTitle, setPushTitle] = useState('');
  const [pushBody, setPushBody] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const handleSendBroadcast = async () => {
    if (!pushTitle || !pushBody) {
      toast({ title: 'Validation Error', description: 'Title and Body are required', variant: 'destructive' });
      return;
    }

    // confirm dialog? For now direct send
    if (!confirm('Are you sure you want to send this notification to ALL users?')) return;

    setSendingBroadcast(true);
    try {
      const result = await NotificationService.sendBroadcast(pushTitle, pushBody);
      if (result.success) {
        toast({ title: 'Broadcast Sent', description: `Successfully sent to ${result.sent_count} devices.` });
        setPushTitle('');
        setPushBody('');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to send broadcast.', variant: 'destructive' });
    } finally {
      setSendingBroadcast(false);
    }
  };

  // Currency Management
  const fetchCurrencies = async () => {
    setLoadingCurrencies(true);
    try {
      const data = await CurrencyService.getCurrencies();
      setCurrencies(data);
      // Also fetch rates when we fetch currencies
      await fetchRates();
    } catch (error) {
      console.error('Error fetching currencies:', error);
      toast({ title: 'Error', description: 'Failed to load currencies', variant: 'destructive' });
    } finally {
      setLoadingCurrencies(false);
    }
  };

  const handleToggleCurrency = async (id: number) => {
    try {
      await CurrencyService.toggleCurrency(id);
      toast({ title: 'Currency updated', description: 'Currency status changed successfully' });
      fetchCurrencies();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to toggle currency', variant: 'destructive' });
    }
  };

  // Currency Create/Delete
  const [showNewCurrencyDialog, setShowNewCurrencyDialog] = useState(false);
  const [newCurrencyType, setNewCurrencyType] = useState<'crypto' | 'fiat'>('crypto');
  const [newCurrencyForm, setNewCurrencyForm] = useState({ name: '', description: '', iso_code: '' });
  const [currencyToDelete, setCurrencyToDelete] = useState<Currency | null>(null);

  const handleCreateCurrency = async () => {
    if (!newCurrencyForm.name || !newCurrencyForm.iso_code) {
      toast({ title: 'Validation Error', description: 'Name and ISO code are required', variant: 'destructive' });
      return;
    }

    try {
      await CurrencyService.createCurrency({
        name: newCurrencyForm.name,
        description: newCurrencyForm.description,
        iso_code: newCurrencyForm.iso_code,
        is_crypto: newCurrencyType === 'crypto'
      });
      toast({ title: 'Success', description: `${newCurrencyForm.name} created and conversion pairs generated` });
      setShowNewCurrencyDialog(false);
      setNewCurrencyForm({ name: '', description: '', iso_code: '' });
      fetchCurrencies(); // This also fetches rates
    } catch (error: any) {
      toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to create currency', variant: 'destructive' });
    }
  };

  const handleDeleteCurrency = async () => {
    if (!currencyToDelete) return;

    try {
      await CurrencyService.deleteCurrency(currencyToDelete.id);
      toast({ title: 'Success', description: `${currencyToDelete.name} deactivated successfully` });
      setCurrencyToDelete(null);
      fetchCurrencies();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete currency', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">System Configuration</h1>
        <p className="text-muted-foreground">Platform settings, fees, and permissions</p>
      </div>

      <Tabs defaultValue="fees" className="space-y-6" onValueChange={(v) => {
        if (v === 'registration') fetchRegistrationConfig();
        if (v === 'fees') fetchFees();
        if (v === 'currencies') fetchCurrencies();
        if (v === 'notifications') fetchNotificationProviders();
      }}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="fees" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Fees
          </TabsTrigger>
          <TabsTrigger value="currencies" className="gap-2">
            <Bitcoin className="h-4 w-4" />
            Currencies
          </TabsTrigger>
          <TabsTrigger value="registration" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Registration
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        < TabsContent value="fees" className="space-y-6" >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-3 md:col-span-1">
              <CardHeader>
                <CardTitle>Wallet Fees</CardTitle>
                <CardDescription>Deposit and withdrawal fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingFees && fees.length === 0 ? (
                  <div className="text-center py-4">Loading fees...</div>
                ) : (
                  Array.isArray(fees) && fees.map((fee) => (
                    <div key={fee.id} className="space-y-2">
                      <Label>
                        {fee.currency?.iso_code || '?'} - {fee.transfertFiatDirection?.description || 'Unknown'} (%)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={feeValues[fee.id] || ''}
                          onChange={(e) => {
                            setFeeValues({ ...feeValues, [fee.id]: e.target.value });
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            {/* ... Other cards ... */}
          </div>
          <Button className="gap-2" onClick={handleSaveFees} disabled={loadingFees}>
            <Save className="h-4 w-4" />Save Wallet Fees
          </Button>
        </TabsContent >

        {/* Unified Currencies Tab */}
        <TabsContent value="currencies" className="space-y-6">
          {loadingCurrencies ? (
            <div className="flex items-center justify-center h-64">Loading currencies...</div>
          ) : (
            <div className="space-y-6">
              {/* Cryptocurrencies Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Supported Cryptocurrencies</CardTitle>
                      <CardDescription>Enable or disable cryptocurrency support</CardDescription>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => { setNewCurrencyType('crypto'); setShowNewCurrencyDialog(true); }}>
                      <Plus className="h-4 w-4 mr-2" />Add Crypto
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currencies.filter(c => c.is_crypto).map((currency) => (
                      <div key={currency.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary">{currency.iso_code}</Badge>
                          <div>
                            <span className="font-medium">{currency.name}</span>
                            <p className="text-xs text-muted-foreground">{currency.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={currency.is_active}
                            onCheckedChange={() => handleToggleCurrency(currency.id)}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setCurrencyToDelete(currency)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fiat Currencies Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Supported Fiat Currencies</CardTitle>
                      <CardDescription>Enable or disable fiat currency support</CardDescription>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => { setNewCurrencyType('fiat'); setShowNewCurrencyDialog(true); }}>
                      <Plus className="h-4 w-4 mr-2" />Add Fiat
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currencies.filter(c => !c.is_crypto).map((currency) => (
                      <div key={currency.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{currency.iso_code}</Badge>
                          <div>
                            <span className="font-medium">{currency.name}</span>
                            <p className="text-xs text-muted-foreground">{currency.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={currency.is_active}
                            onCheckedChange={() => handleToggleCurrency(currency.id)}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setCurrencyToDelete(currency)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Rates Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rates</CardTitle>
                  <CardDescription>Manage exchange rates and fees for active currency pairs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingRates ? (
                    <div className="text-center py-4">Loading rates...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.isArray(rates) && rates.map((rate) => (
                        <div key={rate.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{rate.from_currency?.iso_code || 'Unknown'} → {rate.to_currency?.iso_code || 'Unknown'}</span>
                            <Badge variant="outline" className="text-xs">ID: {rate.id}</Badge>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Exchange Rate (1 {rate.from_currency?.iso_code || '?'} = ? {rate.to_currency?.iso_code || '?'})</Label>
                            <Input
                              type="number"
                              step="0.00000001"
                              value={rateValues[rate.id]?.rate || ''}
                              onChange={(e) => {
                                setRateValues(prev => ({
                                  ...prev,
                                  [rate.id]: { ...prev[rate.id], rate: e.target.value }
                                }))
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Fee (%)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={rateValues[rate.id]?.fee || ''}
                              onChange={(e) => {
                                setRateValues(prev => ({
                                  ...prev,
                                  [rate.id]: { ...prev[rate.id], fee: e.target.value }
                                }))
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button className="gap-2 mt-4" onClick={handleSaveRates} disabled={loadingRates}>
                    <Save className="h-4 w-4" />Save Conversion Rates
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Registration Tab */}
        < TabsContent value="registration" className="space-y-6" >
          {
            loadingConfig ? (
              <div className="flex items-center justify-center h-64" > Loading...</div>
            ) : registrationConfig ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Countries */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />Countries
                      </CardTitle>
                      <Button size="sm" variant="outline" onClick={() => setShowNewCountry(true)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showNewCountry && (
                      <div className="p-3 mb-3 rounded-lg border bg-muted/30 space-y-2">
                        <Input placeholder="Name" value={newCountry.name} onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })} />
                        <Input placeholder="Code (e.g. CM)" value={newCountry.code} onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value })} />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleCreateCountry}><Check className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setShowNewCountry(false)}><X className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {registrationConfig.countries.map((country) => (
                        <div key={country.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          {editingCountry?.id === country.id ? (
                            <div className="flex-1 space-y-1">
                              <Input value={editingCountry.name} onChange={(e) => setEditingCountry({ ...editingCountry, name: e.target.value })} />
                              <Input value={editingCountry.code} onChange={(e) => setEditingCountry({ ...editingCountry, code: e.target.value })} />
                              <div className="flex gap-1">
                                <Button size="icon-sm" onClick={handleUpdateCountry}><Check className="h-3 w-3" /></Button>
                                <Button size="icon-sm" variant="outline" onClick={() => setEditingCountry(null)}><X className="h-3 w-3" /></Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{country.code}</Badge>
                                <span className="text-sm">{country.name}</span>
                              </div>
                              <div className="flex gap-1">
                                <Button size="icon-sm" variant="ghost" onClick={() => setEditingCountry(country)}><Pencil className="h-3 w-3" /></Button>
                                <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteCountry(country.id)}><Trash2 className="h-3 w-3" /></Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Cities */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />Cities
                      </CardTitle>
                      <Button size="sm" variant="outline" onClick={() => setShowNewCity(true)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showNewCity && (
                      <div className="p-3 mb-3 rounded-lg border bg-muted/30 space-y-2">
                        <Input placeholder="City name" value={newCity.name} onChange={(e) => setNewCity({ ...newCity, name: e.target.value })} />
                        <Select onValueChange={(v) => setNewCity({ ...newCity, countryId: parseInt(v) })}>
                          <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                          <SelectContent>
                            {registrationConfig.countries.map((c) => (
                              <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleCreateCity}><Check className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setShowNewCity(false)}><X className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {registrationConfig.cities.map((city) => (
                        <div key={city.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          {editingCity?.id === city.id ? (
                            <div className="flex-1 space-y-1">
                              <Input value={editingCity.name} onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })} />
                              <div className="flex gap-1">
                                <Button size="icon-sm" onClick={handleUpdateCity}><Check className="h-3 w-3" /></Button>
                                <Button size="icon-sm" variant="outline" onClick={() => setEditingCity(null)}><X className="h-3 w-3" /></Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{city.name}</span>
                                <span className="text-xs text-muted-foreground">{city.country?.name}</span>
                              </div>
                              <div className="flex gap-1">
                                <Button size="icon-sm" variant="ghost" onClick={() => setEditingCity(city)}><Pencil className="h-3 w-3" /></Button>
                                <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteCity(city.id)}><Trash2 className="h-3 w-3" /></Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Genders */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />Genders
                      </CardTitle>
                      <Button size="sm" variant="outline" onClick={() => setShowNewGender(true)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showNewGender && (
                      <div className="p-3 mb-3 rounded-lg border bg-muted/30 space-y-2">
                        <Input placeholder="Gender name" value={newGender.name} onChange={(e) => setNewGender({ name: e.target.value })} />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleCreateGender}><Check className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setShowNewGender(false)}><X className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {registrationConfig.genders.map((gender) => (
                        <div key={gender.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          {editingGender?.id === gender.id ? (
                            <div className="flex-1 space-y-1">
                              <Input value={editingGender.name} onChange={(e) => setEditingGender({ ...editingGender, name: e.target.value })} />
                              <div className="flex gap-1">
                                <Button size="icon-sm" onClick={handleUpdateGender}><Check className="h-3 w-3" /></Button>
                                <Button size="icon-sm" variant="outline" onClick={() => setEditingGender(null)}><X className="h-3 w-3" /></Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="text-sm font-medium">{gender.name}</span>
                              <div className="flex gap-1">
                                <Button size="icon-sm" variant="ghost" onClick={() => setEditingGender(gender)}><Pencil className="h-3 w-3" /></Button>
                                <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteGender(gender.id)}><Trash2 className="h-3 w-3" /></Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">Click to load registration configuration</div>
            )
          }
        </TabsContent >

        {/* Roles Tab */}
        < TabsContent value="roles" className="space-y-6" >
          <Card>
            <CardHeader>
              <CardTitle>Admin Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { role: 'Super Admin', permissions: ['All Access'] },
                  { role: 'Admin Finance', permissions: ['Wallets', 'Transactions'] },
                  { role: 'Support', permissions: ['Users (Read)', 'Disputes'] },
                ].map((item) => (
                  <div key={item.role} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <span className="font-medium">{item.role}</span>
                      <div className="flex gap-2 mt-1">
                        {item.permissions.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent >

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={fetchNotificationProviders} disabled={loadingConfig}>
              Refresh List
            </Button>
          </div>
          {/* Debug Error Message */}
          <div className="text-red-500 text-sm hidden" id="debug-error"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Providers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Email Providers</CardTitle>
                </div>
                <CardDescription>Manage active email services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationProviders.filter(p => p.type === 'EMAIL').length === 0 && (
                  <div className="text-muted-foreground text-sm p-4 bg-muted/20 rounded-md text-center">
                    No email providers found. <br />
                    <span className="text-xs opacity-75">Click refresh/Check console</span>
                  </div>
                )}
                {notificationProviders.filter(p => p.type === 'EMAIL').map(provider => (
                  <div key={provider.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Badge variant={provider.isActive ? "default" : "outline"}>{provider.name}</Badge>
                      {provider.isActive && <span className="text-xs text-green-500 font-medium">Active</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditProvider(provider)}>Configure</Button>
                      <Switch checked={provider.isActive} onCheckedChange={() => handleToggleProvider(provider.id)} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* SMS Providers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> SMS Providers</CardTitle>
                </div>
                <CardDescription>Manage active SMS services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationProviders.filter(p => p.type === 'SMS').length === 0 && <div className="text-muted-foreground text-sm">No SMS providers found.</div>}
                {notificationProviders.filter(p => p.type === 'SMS').map(provider => (
                  <div key={provider.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Badge variant={provider.isActive ? "default" : "outline"}>{provider.name}</Badge>
                      {provider.isActive && <span className="text-xs text-green-500 font-medium">Active</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditProvider(provider)}>Configure</Button>
                      <Switch checked={provider.isActive} onCheckedChange={() => handleToggleProvider(provider.id)} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Mass Push Notification Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Mass Push Notification</CardTitle>
              </div>
              <CardDescription>Send a push notification to all users with active devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="push-title">Title</Label>
                  <Input
                    id="push-title"
                    placeholder="e.g. Maintenance Update"
                    value={pushTitle}
                    onChange={(e) => setPushTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="push-body">Message Body</Label>
                  <Textarea
                    id="push-body"
                    placeholder="Enter your message here..."
                    value={pushBody}
                    onChange={(e) => setPushBody(e.target.value)}
                    className="h-24"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSendBroadcast} disabled={sendingBroadcast || !pushTitle || !pushBody}>
                    <Bell className="mr-2 h-4 w-4" />
                    {sendingBroadcast ? 'Sending...' : 'Send Broadcast'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'New user registration', enabled: true },
                { label: 'Large withdrawals', enabled: true },
                { label: 'New disputes', enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Currency Dialog */}
        <Dialog open={showNewCurrencyDialog} onOpenChange={setShowNewCurrencyDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New {newCurrencyType === 'crypto' ? 'Cryptocurrency' : 'Fiat Currency'}</DialogTitle>
              <DialogDescription>
                Create a new currency. Conversion pairs will be automatically generated.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="iso_code">ISO Code *</Label>
                <Input
                  id="iso_code"
                  placeholder="BTC, USD, XAF"
                  maxLength={4}
                  value={newCurrencyForm.iso_code}
                  onChange={(e) => setNewCurrencyForm({ ...newCurrencyForm, iso_code: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Bitcoin, US Dollar"
                  value={newCurrencyForm.name}
                  onChange={(e) => setNewCurrencyForm({ ...newCurrencyForm, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the currency"
                  value={newCurrencyForm.description}
                  onChange={(e) => setNewCurrencyForm({ ...newCurrencyForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewCurrencyDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateCurrency}>Create & Generate Pairs</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Currency Confirmation Dialog */}
        <Dialog open={!!currencyToDelete} onOpenChange={(open) => !open && setCurrencyToDelete(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Deactivate Currency</DialogTitle>
              <DialogDescription>
                Are you sure you want to deactivate <strong>{currencyToDelete?.name}</strong>?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                This will:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Set the currency as inactive</li>
                <li>Remove all related conversion rate pairs</li>
                <li>Preserve historical transaction data</li>
              </ul>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCurrencyToDelete(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteCurrency}>Deactivate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingProvider} onOpenChange={(open) => !open && setEditingProvider(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Configure {editingProvider?.name}</DialogTitle>
              <DialogDescription>
                Update credentials and settings for this provider.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="credentials">Credentials (JSON)</Label>
                <Textarea
                  id="credentials"
                  value={providerCredentialsJson}
                  onChange={(e) => setProviderCredentialsJson(e.target.value)}
                  className="h-32 font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Required format depends on provider (e.g. apiKey for Resend, host/user/pass for SMTP).
                </p>
              </div>

              {editingProvider?.type === 'EMAIL' && (
                <div className="p-4 border rounded-md bg-muted/20 space-y-3">
                  <Label>Send Test Email</Label>
                  <div className="flex gap-2">
                    <Input
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="Enter recipient email"
                      className="bg-background"
                    />
                    <Button onClick={handleSendTestEmail} disabled={sendingTest}>
                      {sendingTest ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleSaveProvider}>Save Configuration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Tabs >
    </div >
  );
}
