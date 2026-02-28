'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { PlusIcon, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  usePaymentMethods,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
} from '@/hooks/usePaymentMethod';
import { PaymentMethodRequest, PaymentMethodRequestSchema, PaymentMethod } from '@/validations/paymentMethod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Props = {
  triggerCreate?: boolean;
  onCreateHandled?: () => void;
};

export function PaymentMethodList({ triggerCreate, onCreateHandled }: Props) {
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);

  const size = 10;

  const { data, isLoading, error } = usePaymentMethods({ page, size });
  const createMutation = useCreatePaymentMethod();
  const updateMutation = useUpdatePaymentMethod();
  const deleteMutation = useDeletePaymentMethod();

  const methods = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.number ?? 0;

  const start = methods.length ? currentPage * size + 1 : 0;
  const end = Math.min(start + methods.length - 1, totalElements);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentMethodRequest>({
    resolver: zodResolver(PaymentMethodRequestSchema),
    defaultValues: { name: '', description: '', status: 'ACTIVE' },
  });

  useEffect(() => {
    if (triggerCreate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditing(null);
      reset({ name: '', description: '', status: 'ACTIVE' });
      setDialogOpen(true);
      onCreateHandled?.();
    }
  }, [triggerCreate, onCreateHandled, reset]);

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', description: '', status: 'ACTIVE' });
    setDialogOpen(true);
  };

  const openEdit = (pm: PaymentMethod) => {
    setEditing(pm);
    reset({ name: pm.name, description: pm.description ?? '', status: pm.status });
    setDialogOpen(true);
  };

  const onSubmit = async (data: PaymentMethodRequest) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload: data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setDialogOpen(false);
    reset();
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const mutationError = createMutation.error || updateMutation.error;

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Payment Methods</CardTitle>
            <CardDescription className="text-sm">Manage available payment methods</CardDescription>
          </div>
          <Button size="sm" onClick={openCreate}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Method
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-hidden rounded-b-xl border-t">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold tracking-wider uppercase">Name</TableHead>
                  <TableHead className="text-xs font-semibold tracking-wider uppercase">Description</TableHead>
                  <TableHead className="text-xs font-semibold tracking-wider uppercase">Status</TableHead>
                  <TableHead className="text-xs font-semibold tracking-wider uppercase">Created</TableHead>
                  <TableHead className="w-24 text-right text-xs font-semibold tracking-wider uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <div className="bg-muted h-4 w-full animate-pulse rounded" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                {!isLoading && error && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-destructive py-10 text-center text-sm">
                      Failed to load payment methods
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error && methods.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground py-10 text-center text-sm">
                      No payment methods found
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  methods.map(pm => (
                    <TableRow key={pm.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-medium">{pm.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{pm.description ?? '—'}</TableCell>
                      <TableCell>
                        <Badge variant={pm.status === 'ACTIVE' ? 'default' : 'secondary'}>{pm.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {pm.createdAt ? format(new Date(pm.createdAt), 'MMM dd, yyyy') : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(pm)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-8 w-8"
                            onClick={() => setDeleteTarget(pm)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t px-6 py-4">
              <p className="text-muted-foreground text-sm">
                Showing{' '}
                <span className="text-foreground font-medium">
                  {start}–{end}
                </span>{' '}
                of <span className="text-foreground font-medium">{totalElements}</span> methods
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage === 0}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={i === currentPage ? 'default' : 'outline'}
                    size="icon"
                    className="h-8 w-8 text-xs"
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={open => {
          if (!open) {
            setDialogOpen(false);
            reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Payment Method' : 'Add Payment Method'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            {mutationError && (
              <Alert variant="destructive">
                <AlertDescription>{(mutationError as Error).message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label>
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Cash, Bank Transfer"
                {...register('name')}
                className={errors.name ? 'border-destructive focus-visible:ring-destructive/30' : ''}
              />
              {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input placeholder="Optional description" {...register('description')} />
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
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? 'Save Changes' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
