'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Landmark, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login.mutate(data, {
      onSuccess: (res) => {
        document.cookie = `token=${res.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
        router.push('/dashboard');
        router.refresh();
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="bg-primary rounded-2xl p-3 shadow-lg">
            <Landmark className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Loan Management System</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to access your dashboard</p>
          </div>
        </div>

        <Card className="shadow-xl border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">Enter your credentials to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-foreground text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  {...register('username')}
                  placeholder="Enter your username"
                  autoComplete="username"
                  className={errors.username ? 'border-destructive focus-visible:ring-destructive/30' : ''}
                />
                {errors.username && (
                  <p className="text-destructive text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`pr-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {login.isError && (
                <Alert variant="destructive" className="py-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Invalid username or password. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={login.isPending}
                className="w-full mt-2"
              >
                {login.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>

            </form>
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground text-xs mt-6">
          © {new Date().getFullYear()} Loan Management System
        </p>
      </div>
    </div>
  );
}