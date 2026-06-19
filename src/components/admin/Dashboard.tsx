'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import { Dumbbell, Plus, Edit, Trash2, DollarSign, LogOut, Search, UserPlus, Calendar, AlertCircle, CheckCircle2, Settings, Minus } from 'lucide-react';
import AdminSettings from '@/components/admin/AdminSettings';
import IncomeExpenseChart from '@/components/admin/IncomeExpenseChart';
import MemberJoinsChart from '@/components/admin/MemberJoinsChart';
import ExpensePieChart from '@/components/admin/ExpensePieChart';
import MemberStatusPieChart from '@/components/admin/MemberStatusPieChart';
import NetProfitCard from '@/components/admin/NetProfitCard';
import AddExpenseDialog from '@/components/admin/AddExpenseDialog';

interface Member {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  picture: string | null;
  details: string | null;
  membership_fee: number;
  last_payment_date: string | null;
  membership_start: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const { toast } = useToast();
  const logout = useAuthStore((state) => state.logout);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: '',
    membershipFee: '0',
    picture: null as File | null,
    lastPaymentDate: new Date(),
  });

  useEffect(() => {
    fetchMembers();
    fetchAnalytics();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      const data = await response.json();
      setMembers(data.members || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch members',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Analytics API error:', errorData);
        setAnalytics({
          monthlyData: [],
          totalIncome: 0,
          totalExpenses: 0,
          netProfit: 0,
          expenseChartData: [],
          memberStatusData: [
            { name: 'Active', value: 0, fill: 'hsl(142, 76%, 36%)' },
            { name: 'Inactive', value: 0, fill: 'hsl(0, 72%, 51%)' }
          ],
          paymentCount: 0,
          expenseCount: 0
        });
        return;
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('Analytics API error:', data.error);
        setAnalytics({
          monthlyData: [],
          totalIncome: 0,
          totalExpenses: 0,
          netProfit: 0,
          expenseChartData: [],
          memberStatusData: [
            { name: 'Active', value: 0, fill: 'hsl(142, 76%, 36%)' },
            { name: 'Inactive', value: 0, fill: 'hsl(0, 72%, 51%)' }
          ],
          paymentCount: 0,
          expenseCount: 0
        });
        return;
      }

      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics({
        monthlyData: [],
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        expenseChartData: [],
        memberStatusData: [
          { name: 'Active', value: 0, fill: 'hsl(142, 76%, 36%)' },
          { name: 'Inactive', value: 0, fill: 'hsl(0, 72%, 51%)' }
        ],
        paymentCount: 0,
        expenseCount: 0
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const checkDuesStatus = (lastPaymentDate: string | null) => {
    if (!lastPaymentDate) return { status: 'due', daysOverdue: 0, label: 'Payment Due' };
    
    const paymentDate = new Date(lastPaymentDate);
    const now = new Date();
    const diffTime = now.getTime() - paymentDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 30) {
      return {
        status: 'overdue',
        daysOverdue: diffDays - 30,
        label: `${diffDays - 30} days overdue`
      };
    } else if (diffDays >= 25) {
      return {
        status: 'warning',
        daysOverdue: 0,
        label: 'Payment due soon'
      };
    }
    
    return {
      status: 'paid',
      daysOverdue: 0,
      label: `Paid - ${30 - diffDays} days left`
    };
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let picture = null;
      
      // Convert image file to base64
      if (formData.picture) {
        picture = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.picture!);
        });
      }

      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          details: formData.details,
          membershipFee: formData.membershipFee,
          picture,
          membershipStart: formData.lastPaymentDate.toISOString(),
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Member added successfully',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          details: '',
          membershipFee: '0',
          picture: null,
          lastPaymentDate: new Date(),
        });
        setIsAddDialogOpen(false);
        fetchMembers();
        fetchAnalytics();
      } else {
        const data = await response.json();
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to add member',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong',
      });
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Member deleted successfully',
        });
        fetchMembers();
        fetchAnalytics();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to delete member',
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  };

  const handleRecordPayment = async (id: string, member: Member) => {
    try {
      const response = await fetch(`/api/members/${id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: member.membership_fee }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Payment recorded successfully',
        });
        fetchMembers();
        fetchAnalytics();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to record payment',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong',
      });
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.phone?.includes(searchQuery)
  );

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const membersWithDue = members.filter(m => {
    const dues = checkDuesStatus(m.last_payment_date);
    return dues.status === 'overdue' || dues.status === 'due';
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
      <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-xl">
                <Dumbbell className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Adnan Fitness Club</h1>
                <p className="text-sm opacity-90">Member Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsSettingsOpen(true)}
                variant="secondary"
                className="gap-2 font-semibold"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button
                onClick={logout}
                variant="secondary"
                className="gap-2 font-semibold"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <UserPlus className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered members
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/20 bg-gradient-to-br from-card to-green-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeMembers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-500/20 bg-gradient-to-br from-card to-red-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dues Pending</CardTitle>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{membersWithDue}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Members with pending dues
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {!analyticsLoading && analytics ? (
            <>
              <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-card to-blue-500/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <DollarSign className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">Rs. {(analytics.totalIncome || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.paymentCount || 0} payments recorded
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-500/20 bg-gradient-to-br from-card to-red-500/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <Minus className="h-5 w-5 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">Rs. {(analytics.totalExpenses || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.expenseCount || 0} expenses recorded
                  </p>
                </CardContent>
              </Card>

              <NetProfitCard
                totalIncome={analytics.totalIncome || 0}
                totalExpenses={analytics.totalExpenses || 0}
                netProfit={analytics.netProfit || 0}
              />
            </>
          ) : analyticsLoading ? (
            <div className="md:col-span-3 text-center py-8 text-muted-foreground">
              Loading financial data...
            </div>
          ) : (
            <div className="md:col-span-3 text-center py-8 text-muted-foreground">
              No financial data available yet. Add members and record payments to see analytics.
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {!analyticsLoading && analytics && analytics.monthlyData && analytics.monthlyData.length > 0 ? (
            <>
              <IncomeExpenseChart data={analytics.monthlyData || []} />
              <MemberJoinsChart data={analytics.monthlyData || []} />
            </>
          ) : analyticsLoading ? (
            <div className="md:col-span-2 text-center py-8 text-muted-foreground">
              Loading charts...
            </div>
          ) : (
            <div className="md:col-span-2 text-center py-8 text-muted-foreground">
              No chart data available yet. Add members and record payments over time to see trends.
            </div>
          )}
        </div>

        {/* Pie Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {!analyticsLoading && analytics && analytics.expenseChartData && analytics.memberStatusData ? (
            <>
              <ExpensePieChart data={analytics.expenseChartData || []} />
              <MemberStatusPieChart data={analytics.memberStatusData || []} />
            </>
          ) : analyticsLoading ? (
            <div className="md:col-span-2 text-center py-8 text-muted-foreground">
              Loading pie charts...
            </div>
          ) : (
            <div className="md:col-span-2 text-center py-8 text-muted-foreground">
              No pie chart data available. Record payments and expenses to see breakdown.
            </div>
          )}
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Member Management</CardTitle>
                <CardDescription>Manage your fitness club members and track payments</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2">
                      <Minus className="h-4 w-4" />
                      Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Record Expense</DialogTitle>
                      <DialogDescription>Expense dialog will appear here</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2">
                      <Plus className="h-4 w-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Member</DialogTitle>
                      <DialogDescription>Enter the member's details below</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMember} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Enter member name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+92 300 1234567"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="membershipFee">Monthly Fee</Label>
                          <Input
                            id="membershipFee"
                            type="number"
                            value={formData.membershipFee}
                            onChange={(e) => setFormData({ ...formData, membershipFee: e.target.value })}
                            placeholder="5000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="picture">Profile Picture</Label>
                          <Input
                            id="picture"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, picture: e.target.files?.[0] || null })}
                          />
                          {formData.picture && (
                            <p className="text-xs text-muted-foreground">Selected: {formData.picture.name}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Last Payment Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {formData.lastPaymentDate.toLocaleDateString('en-PK', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={formData.lastPaymentDate}
                              onSelect={(date) => date && setFormData({ ...formData, lastPaymentDate: date })}
                              disabled={(date) =>
                                date > new Date() || date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="details">Additional Details</Label>
                        <textarea
                          id="details"
                          value={formData.details}
                          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                          className="flex min-h-[80px] w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Any additional notes or details about the member..."
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Add Member
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2"
                />
              </div>
            </div>

            <div className="rounded-lg border-2 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10">
                    <TableHead className="font-bold">Member</TableHead>
                    <TableHead className="font-bold">Contact</TableHead>
                    <TableHead className="font-bold">Monthly Fee</TableHead>
                    <TableHead className="font-bold">Last Payment</TableHead>
                    <TableHead className="font-bold">Payment Status</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <UserPlus className="h-12 w-12" />
                          <p>No members found</p>
                          <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            variant="outline"
                            className="mt-2"
                          >
                            Add your first member
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => {
                      const duesStatus = checkDuesStatus(member.last_payment_date);
                      
                      return (
                        <TableRow key={member.id} className="hover:bg-primary/5">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 border-2 border-primary/20">
                                <AvatarImage src={member.picture || undefined} alt={member.name} />
                                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                  {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{member.name}</p>
                                {member.details && (
                                  <p className="text-sm text-muted-foreground line-clamp-1">{member.details}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {member.email && (
                              <p className="text-sm">{member.email}</p>
                            )}
                            {member.phone && (
                              <p className="text-sm text-muted-foreground">{member.phone}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold">Rs. {member.membership_fee.toLocaleString()}</p>
                          </TableCell>
                          <TableCell>
                            {member.last_payment_date ? (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {new Date(member.last_payment_date).toLocaleDateString('en-PK', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Never</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {duesStatus.status === 'paid' && (
                              <Badge className="bg-green-600 hover:bg-green-700 gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {duesStatus.label}
                              </Badge>
                            )}
                            {duesStatus.status === 'warning' && (
                              <Badge className="bg-yellow-600 hover:bg-yellow-700 gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {duesStatus.label}
                              </Badge>
                            )}
                            {duesStatus.status === 'due' && (
                              <Badge variant="destructive" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {duesStatus.label}
                              </Badge>
                            )}
                            {duesStatus.status === 'overdue' && (
                              <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 gap-1 animate-pulse">
                                <AlertCircle className="h-3 w-3" />
                                {duesStatus.label}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {duesStatus.status !== 'paid' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-green-50 border-green-600 text-green-700 hover:bg-green-100 gap-1"
                                  onClick={() => handleRecordPayment(member.id, member)}
                                >
                                  <DollarSign className="h-4 w-4" />
                                  Pay
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:bg-destructive/10 gap-1"
                                onClick={() => handleDeleteMember(member.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <AdminSettings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <AddExpenseDialog 
        open={isExpenseDialogOpen} 
        onOpenChange={setIsExpenseDialogOpen}
        onSuccess={fetchAnalytics}
      />
    </div>
  );
}