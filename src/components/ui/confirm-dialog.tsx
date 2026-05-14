"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  loading,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-sm">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <TriangleAlert className="h-6 w-6 text-red-500" />
        </div>

        {/* Text */}
        <div className="text-center space-y-1.5 mb-6">
          <DialogTitle className="text-base font-semibold text-gray-900">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-gray-500">
              {description}
            </DialogDescription>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <DialogClose
            render={
              <button className="flex-1 px-4 py-2.5 rounded-sm border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors" />
            }
          >
            Cancel
          </DialogClose>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-sm bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
