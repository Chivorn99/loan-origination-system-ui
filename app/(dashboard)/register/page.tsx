'use client';

import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/useAuth';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { RegisterSchema, RegisterPayload } from '@/validations/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      roleId: 1,
      branchId: 1,
    },
  });

  const onSubmit = async (data: RegisterPayload) => {
    try {
      await registerMutation.mutateAsync(data);
      router.push('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <div className="bg-muted min-h-screen">
      <Card className="mx-y m-6 max-w-7xl space-y-6">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label>Username</Label>
              <Input {...register('username')} placeholder="Enter username" />
              {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...register('email')} placeholder="Enter email" />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input {...register('phoneNumber')} placeholder="+855xxxxxxxx" />
              {errors.phoneNumber && <p className="text-destructive text-sm">{errors.phoneNumber.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" {...register('password')} placeholder="Enter password" />
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Role</Label>
              <select {...register('roleId', { valueAsNumber: true })} className="w-full rounded-md border px-3 py-2">
                <option value={1}>Admin</option>
                <option value={2}>Loan Officer</option>
                <option value={3}>Cashier</option>
              </select>
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label>Branch</Label>
              <select {...register('branchId', { valueAsNumber: true })} className="w-full rounded-md border px-3 py-2">
                <option value={1}>Main Branch</option>
                <option value={2}>Central Branch</option>
                <option value={3}>Riverside Branch</option>
                <option value={4}>Toul Kork Branch</option>
                <option value={5}>Kampong Cham Branch</option>
                <option value={6}>Phnom Penh Main Branch</option>
                <option value={7}>Siem Reap Branch</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Creating...' : 'Register'}
            </Button>

            <Button type="button" variant="outline" className="w-full" onClick={() => router.push('/login')}>
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
