'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ItemForm, ItemStepSchema } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type ItemStepInput = z.input<typeof ItemStepSchema>;
type ItemStepOutput = z.output<typeof ItemStepSchema>;

interface ItemStepProps {
  form: ItemForm;
  onChange: (form: ItemForm) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ItemStep({ form, onChange, onNext, onBack }: ItemStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemStepInput, unknown, ItemStepOutput>({
    resolver: zodResolver(ItemStepSchema),
    defaultValues: {
      itemType: form.itemType || '',
      estimatedValue: form.estimatedValue ? String(form.estimatedValue) : '',
      description: form.description || '',
      photoUrl: form.photoUrl || '',
    },
  });

  const onSubmit = (data: ItemStepOutput) => {
    onChange({ ...form, ...data, photoUrl: data.photoUrl ?? '' });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pawn Item</CardTitle>
          <CardDescription>Describe the collateral being pawned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>
                Item Type <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Jewelry, Electronics"
                {...register('itemType')}
                className={errors.itemType ? 'border-destructive focus-visible:ring-destructive/30' : ''}
              />
              {errors.itemType && <p className="text-destructive text-xs">{errors.itemType.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>
                Estimated Value <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                placeholder="0.00"
                {...register('estimatedValue')}
                className={errors.estimatedValue ? 'border-destructive focus-visible:ring-destructive/30' : ''}
              />
              {errors.estimatedValue && <p className="text-destructive text-xs">{errors.estimatedValue.message}</p>}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Input placeholder="Brief description of the item" {...register('description')} />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Photo URL</Label>
              <Input
                placeholder="https://..."
                {...register('photoUrl')}
                className={errors.photoUrl ? 'border-destructive focus-visible:ring-destructive/30' : ''}
              />
              {errors.photoUrl && <p className="text-destructive text-xs">{errors.photoUrl.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <Button type="submit">
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
