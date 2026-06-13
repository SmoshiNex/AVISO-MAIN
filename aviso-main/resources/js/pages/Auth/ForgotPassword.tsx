import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import AuthLayout from '@/layouts/AuthLayout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout>
            <Head title="Forgot Password" />
            
            <Card className="w-full shadow-2xl border-border/50 bg-card/50 backdrop-blur-xl">
                <CardHeader className="space-y-1 items-center pb-6">
                    <div className="w-16 h-16 flex items-center justify-center mb-4">
                        <img src="/logo.png" alt="Aviso Logo" className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <CardTitle className="text-2xl font-heading tracking-tight">Reset Password</CardTitle>
                    <CardDescription className="text-center mt-2">
                        Forgot your password? No problem. Just let us know your email address and we will email you a password reset link.
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                            {status}
                        </div>
                    )}

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
                                autoFocus
                                required
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        <Button className="w-full mt-6" type="submit" disabled={processing}>
                            Email Password Reset Link
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t p-4">
                    <Link href={route('login')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Return to Login
                    </Link>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
