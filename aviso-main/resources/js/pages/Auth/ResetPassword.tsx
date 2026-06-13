import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthLayout from '@/layouts/AuthLayout';

export default function ResetPassword({ token, email }: { token: string, email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Reset Password" />
            
            <Card className="w-full shadow-2xl border-border/50 bg-card/50 backdrop-blur-xl">
                <CardHeader className="space-y-1 items-center pb-6">
                    <div className="w-16 h-16 flex items-center justify-center mb-4">
                        <img src="/logo.png" alt="Aviso Logo" className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <CardTitle className="text-2xl font-heading tracking-tight">Set New Password</CardTitle>
                    <CardDescription className="text-center mt-2">
                        Please enter your new password below.
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={errors.email ? "border-destructive" : ""}
                                readOnly
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={errors.password ? "border-destructive" : ""}
                                autoFocus
                                required
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className={errors.password_confirmation ? "border-destructive" : ""}
                                required
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <Button className="w-full mt-6" type="submit" disabled={processing}>
                            Reset Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
