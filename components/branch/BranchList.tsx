'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2, PlusIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { type Branch } from '@/validations/branch';
import { useBranches } from '@/hooks/useBranch';
import { branchService } from '@/services/branchService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { BranchFormModal } from './BranchFormModal';

type Props = {
  triggerCreate?: boolean;
  onCreateHandled?: () => void;
};

export function BranchList({ triggerCreate, onCreateHandled }: Props) {
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const size = 10;
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useBranches(page, size);

  const branches: Branch[] = useMemo(() => data?.content ?? [], [data?.content]);
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.number ?? 0;

  const start = branches.length ? currentPage * size + 1 : 0;
  const end = Math.min(start + branches.length - 1, totalElements);

  useEffect(() => {
    if (triggerCreate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditingBranch(null);
      setModalOpen(true);
      onCreateHandled?.();
    }
  }, [triggerCreate, onCreateHandled]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['branches'] });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await branchService.delete(deleteTarget.id);
    invalidate();
    setDeleteTarget(null);
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Branches</CardTitle>
            <CardDescription className="text-sm">Manage pawnshop branch locations</CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditingBranch(null);
              setModalOpen(true);
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-hidden rounded-b-xl border-t">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold tracking-wider uppercase">Name</TableHead>
                  <TableHead className="text-xs font-semibold tracking-wider uppercase">Address</TableHead>
                  <TableHead className="text-xs font-semibold tracking-wider uppercase">Phone</TableHead>
                  <TableHead className="text-xs font-semibold tracking-wider uppercase">Status</TableHead>
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
                      Failed to load branches
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error && branches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground py-10 text-center text-sm">
                      No branches found
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  branches.map(branch => (
                    <TableRow key={branch.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="text-primary font-semibold">{branch.name}</TableCell>
                      <TableCell className="text-sm">{branch.address ?? '—'}</TableCell>
                      <TableCell className="text-sm">{branch.phone ?? '—'}</TableCell>
                      <TableCell>
                        <Badge variant={branch.status === 'ACTIVE' ? 'default' : 'secondary'}>{branch.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingBranch(branch);
                              setModalOpen(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-8 w-8"
                            onClick={() => setDeleteTarget(branch)}
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
                of <span className="text-foreground font-medium">{totalElements}</span> branches
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

      {modalOpen && (
        <BranchFormModal
          branch={editingBranch}
          onClose={() => {
            setModalOpen(false);
            setEditingBranch(null);
          }}
          onSuccess={invalidate}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Branch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
