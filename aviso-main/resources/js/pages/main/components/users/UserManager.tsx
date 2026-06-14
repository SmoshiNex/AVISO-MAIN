import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    UserCircle,
    Shield,
    Trash2,
    Edit,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    Eye
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { type User, type PaginatedData } from '@/types/models';
import { toast } from '@/lib/toast';
import { UserViewModal } from './UserViewModal';
import { sanitizeText, sanitizeAlphanumeric } from '@/lib/sanitize';
import { PasswordChecker } from '@/components/ui/PasswordChecker';

interface UserManagerProps {
    users: PaginatedData<User>;
    filters: {
        search?: string;
        role?: string;
    };
}

export function UserManager({ users, filters }: UserManagerProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);

    const { data: formData, setData: setFormData, transform, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        contact_number: '',
        address: '',
        role: 'rider',
        password: '',
        password_confirmation: '',
    });

    // Register a transform hook to sanitize data before sending to server
    transform((data) => ({
        ...data,
        first_name: sanitizeText(data.first_name),
        last_name: sanitizeText(data.last_name),
        username: sanitizeAlphanumeric(data.username),
        contact_number: sanitizeText(data.contact_number),
        address: sanitizeText(data.address),
    }));

    const handleFilterChange = (key: 'role', value: string) => {
        router.get(route('users.index'), { search: searchQuery, [key]: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('users.index'), { search: searchQuery, role: filters.role || 'all' }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openCreateModal = () => {
        setEditingUser(null);
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const openViewModal = (user: User) => {
        setViewingUser(user);
        setIsViewModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        clearErrors();
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            email: user.email,
            contact_number: user.contact_number || '',
            address: user.address || '',
            role: user.role,
            password: '', // Empty unless changing
            password_confirmation: '',
        });
        setIsModalOpen(true);
    };

    const submitUser = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            put(route('users.update', editingUser.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('User updated successfully');
                },
                onError: (err) => {
                    toast.error({
                        title: 'Failed to update user',
                        description: Object.values(err)[0] as string || 'Please check the form for errors.'
                    });
                }
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('User created successfully');
                },
                onError: (err) => {
                    toast.error({
                        title: 'Failed to create user',
                        description: Object.values(err)[0] as string || 'Please check the form for errors.'
                    });
                }
            });
        }
    };

    const confirmDelete = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (!userToDelete) return;
        destroy(route('users.destroy', userToDelete.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                toast.success('User deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete user');
            }
        });
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button onClick={openCreateModal}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create User
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm">
                {/* Filters */}
                <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center bg-muted/20">
                    <form onSubmit={submitSearch} className="relative w-full sm:w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search name, username, email..."
                            className="pl-9 bg-background"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <div className="flex w-full sm:w-auto gap-3 flex-1 sm:justify-end">
                        <Select value={filters.role || 'all'} onValueChange={(v) => handleFilterChange('role', v)}>
                            <SelectTrigger className="w-[140px] bg-background">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admins</SelectItem>
                                <SelectItem value="rider">Riders</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead className="font-semibold">Name</TableHead>
                                <TableHead className="font-semibold">Username</TableHead>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">Contact</TableHead>
                                <TableHead className="font-semibold">Role</TableHead>
                                <TableHead className="font-semibold">Created At</TableHead>
                                <TableHead className="font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-muted/20">
                                        <TableCell className="font-medium">
                                            {user.first_name} {user.last_name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">@{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="text-muted-foreground">{user.contact_number || '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300'}>
                                                {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <UserCircle className="w-3 h-3 mr-1" />}
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openViewModal(user)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEditModal(user)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => confirmDelete(user)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                            Showing <span className="font-medium text-foreground">{(users.current_page - 1) * users.per_page + 1}</span> to{' '}
                            <span className="font-medium text-foreground">{Math.min(users.current_page * users.per_page, users.total)}</span> of{' '}
                            <span className="font-medium text-foreground">{users.total}</span> entries
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                disabled={users.current_page === 1}
                                onClick={() => router.get(users.links[0].url as string)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            <div className="flex items-center gap-1">
                                {users.links.slice(1, -1).map((link, i) => {
                                    if (link.label === '...') return <span key={i} className="px-2">...</span>;
                                    return (
                                        <Button
                                            key={i}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            className={`h-8 w-8 p-0 ${link.active ? 'bg-primary text-primary-foreground' : ''}`}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>

                            <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8"
                                disabled={users.current_page === users.last_page}
                                onClick={() => router.get(users.links[users.links.length - 1].url as string)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Create / Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={submitUser}>
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
                            <DialogDescription>
                                {editingUser ? 'Update the user details below.' : 'Add a new administrator or rider account to the system.'}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input id="first_name" value={formData.first_name} onChange={e => setFormData('first_name', e.target.value)} onBlur={e => setFormData('first_name', sanitizeText(e.target.value))} required />
                                    {errors.first_name && <p className="text-xs text-destructive">{errors.first_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input id="last_name" value={formData.last_name} onChange={e => setFormData('last_name', e.target.value)} onBlur={e => setFormData('last_name', sanitizeText(e.target.value))} required />
                                    {errors.last_name && <p className="text-xs text-destructive">{errors.last_name}</p>}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" value={formData.username} onChange={e => setFormData('username', sanitizeAlphanumeric(e.target.value))} required />
                                    {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={formData.role} onValueChange={(v) => setFormData('role', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                            <SelectItem value="rider">Rider</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value={formData.email} onChange={e => setFormData('email', e.target.value)} required />
                                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_number">Contact Number <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                <Input id="contact_number" value={formData.contact_number} onChange={e => setFormData('contact_number', e.target.value)} onBlur={e => setFormData('contact_number', sanitizeText(e.target.value))} />
                                {errors.contact_number && <p className="text-xs text-destructive">{errors.contact_number}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                                </Label>
                                <Input id="password" type="password" value={formData.password} onChange={e => setFormData('password', e.target.value)} required={!editingUser} />
                                {formData.password && <PasswordChecker password={formData.password} />}
                                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                            </div>

                            {(formData.password || !editingUser) && (
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input id="password_confirmation" type="password" value={formData.password_confirmation} onChange={e => setFormData('password_confirmation', e.target.value)} required={!!formData.password || !editingUser} />
                                    {errors.password_confirmation && <p className="text-xs text-destructive">{errors.password_confirmation}</p>}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editingUser ? 'Save Changes' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the account for <strong>{userToDelete?.first_name} {userToDelete?.last_name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={executeDelete} disabled={processing}>
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View User & Emergency Contacts Modal */}
            <UserViewModal 
                user={viewingUser} 
                isOpen={isViewModalOpen} 
                onClose={() => setIsViewModalOpen(false)} 
            />
        </>
    );
}
