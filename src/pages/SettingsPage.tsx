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
  Check
} from 'lucide-react';
import { RegistrationConfigService, RegistrationConfig, Country, City, Gender } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  const [registrationConfig, setRegistrationConfig] = useState<RegistrationConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">System Configuration</h1>
        <p className="text-muted-foreground">Platform settings, fees, and permissions</p>
      </div>

      <Tabs defaultValue="fees" className="space-y-6" onValueChange={(v) => v === 'registration' && fetchRegistrationConfig()}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="fees" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Fees
          </TabsTrigger>
          <TabsTrigger value="cryptos" className="gap-2">
            <Bitcoin className="h-4 w-4" />
            Cryptos
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

        {/* Fees Tab */}
        <TabsContent value="fees" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Fees</CardTitle>
                <CardDescription>Deposit and withdrawal fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Deposit Fee (%)</Label>
                  <Input type="number" defaultValue="0" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Withdrawal Fee (%)</Label>
                  <Input type="number" defaultValue="0.1" step="0.01" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>P2P Fees</CardTitle>
                <CardDescription>Trading fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Maker Fee (%)</Label>
                  <Input type="number" defaultValue="0.1" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Taker Fee (%)</Label>
                  <Input type="number" defaultValue="0.15" step="0.01" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Fees</CardTitle>
                <CardDescription>Product sales fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Seller Fee (%)</Label>
                  <Input type="number" defaultValue="2.5" step="0.1" />
                </div>
              </CardContent>
            </Card>
          </div>
          <Button className="gap-2"><Save className="h-4 w-4" />Save Fees</Button>
        </TabsContent>

        {/* Cryptos Tab */}
        <TabsContent value="cryptos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supported Cryptocurrencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { symbol: 'USDT', name: 'Tether', enabled: true },
                  { symbol: 'USDC', name: 'USD Coin', enabled: true },
                  { symbol: 'XAF', name: 'CFA Franc', enabled: true },
                ].map((crypto) => (
                  <div key={crypto.symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{crypto.symbol}</Badge>
                      <span>{crypto.name}</span>
                    </div>
                    <Switch defaultChecked={crypto.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Registration Tab */}
        <TabsContent value="registration" className="space-y-6">
          {loadingConfig ? (
            <div className="flex items-center justify-center h-64">Loading...</div>
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
          )}
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
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
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
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
      </Tabs>
    </div>
  );
}
