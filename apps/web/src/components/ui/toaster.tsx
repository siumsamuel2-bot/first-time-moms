import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { createContext, useCallback, useContext, useState } from 'react';

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
  [key: string]: unknown;
}

interface ToastContextType {
  toasts: ToastData[];
  toast: (options: Omit<ToastData, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProviderComponent({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((options: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...options, id }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastProvider>
        {toasts.map(({ id, title, description, action, variant, ...props }) => (
          <Toast key={id} {...props} data-variant={variant}>
            <div className="grid gap-1">
              <div className="flex items-start gap-3">
                <div className="grid gap-1">
                  <ToastTitle>{title}</ToastTitle>
                  <ToastDescription>{description}</ToastDescription>
                </div>
              </div>
              {action}
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function useToastHelpers() {
  const { toast } = useToast();

  const success = (title: string, description?: string) =>
    toast({ title, description, variant: 'default' });
  const error = (title: string, description?: string) =>
    toast({ title, description, variant: 'destructive' });
  const info = (title: string, description?: string) =>
    toast({ title, description, variant: 'default' });
  const warning = (title: string, description?: string) =>
    toast({ title, description, variant: 'default' });

  return { toast, success, error, info, warning };
}
