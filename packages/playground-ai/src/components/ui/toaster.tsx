'use client';

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { useToastStore } from '@/lib/models/toast';
import { useEffect } from 'react';

export function Toaster() {
  const { toasts, toast } = useToast();
  const { toasts: toastStore } = useToastStore();

  useEffect(() => {
    toastStore.forEach((toastData) => {
      if (!toastData.hasShowed) {
        toast({ title: toastData.title, description: toastData.description });
        toastData.hasShowed = true;
      }
    });
  }, [toast, toastStore]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
