'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { type Branch, BranchRequestSchema, type BranchRequest } from '@/validations/branch';
import { branchService } from '@/services/branchService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller } from 'react-hook-form';

type Props = {
  branch: Branch | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function BranchFormModal({ branch, onClose, onSuccess }: Props) {
  const isEditing = !!branch;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BranchRequest>({
    resolver: zodResolver(BranchRequestSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name,
        address: branch.address ?? '',
        phone: branch.phone ?? '',
        status: branch.status,
      });
    } else {
      reset({ name: '', address: '', phone: '', status: 'ACTIVE' });
    }
  }, [branch, reset]);

  const onSubmit = async (data: BranchRequest) => {
    if (isEditing) {
      await branchService.update(branch.id, data);
    } else {
      await branchService.create(data);
    }
    onSuccess();
    onClose();
  };

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {isSubmitting && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
            </div>
          )}

          <div className="space-y-1.5">
            <Label>
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Main Branch"
              {...register('name')}
              className={errors.name ? 'border-destructive focus-visible:ring-destructive/30' : ''}
            />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input
              placeholder="Street, City, Country"
              {...register('address')}
              className={errors.address ? 'border-destructive focus-visible:ring-destructive/30' : ''}
            />
            {errors.address && <p className="text-destructive text-xs">{errors.address.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input
              placeholder="e.g. +1 555 000 1234"
              {...register('phone')}
              className={errors.phone ? 'border-destructive focus-visible:ring-destructive/30' : ''}
            />
            {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
