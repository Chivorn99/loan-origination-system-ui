'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';
import { CustomerForm, CustomerStepSchema, CustomerStepData } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CustomerStepProps {
  form: CustomerForm;
  onChange: (form: CustomerForm) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function CustomerStep({ form, onChange, onNext, onCancel }: CustomerStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerStepData>({
    resolver: zodResolver(CustomerStepSchema),
    defaultValues: form,
  });

  const onSubmit = (data: CustomerStepData) => {
    onChange({ ...form, ...data });
    onNext();
  };

  const fields: { key: keyof CustomerStepData; label: string; placeholder: string; required?: boolean }[] = [
    { key: 'fullName', label: 'Full Name', placeholder: 'e.g. John Smith', required: true },
    { key: 'phone', label: 'Phone Number', placeholder: 'e.g. +1 555 000 1234', required: true },
    { key: 'idNumber', label: 'ID Number', placeholder: 'National ID or Passport', required: true },
    { key: 'address', label: 'Address', placeholder: 'Street, City, Country' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Information</CardTitle>
          <CardDescription>Enter the borrower personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-5">
            {fields.map(({ key, label, placeholder, required }) => (
              <div key={key} className="space-y-1.5">
                <Label>
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Input
                  placeholder={placeholder}
                  {...register(key)}
                  className={errors[key] ? 'border-destructive focus-visible:ring-destructive/30' : ''}
                />
                {errors[key] && <p className="text-destructive text-xs">{errors[key]?.message}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
