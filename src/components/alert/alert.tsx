import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle, CircleAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomAlertProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
}

const CustomAlert = ({ message, type, onClose, className }: CustomAlertProps) => {
  const icons = {
    success: CheckCircle2,
    error: CircleAlert,
    warning: AlertCircle,
    info: Info
  };

  const Icon = icons[type];
  
  const styles = {
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    info: "bg-blue-50 text-blue-700 border-blue-200"
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-right-full duration-300">
        <Alert 
          className={cn(styles[type], "flex items-center", className)}
          role="alert"
        >
          <Icon className="h-4 w-4" />
          <AlertDescription className="ml-2">{message}</AlertDescription>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto hover:opacity-70"
              aria-label="Close alert"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </Alert>
    </div>
  );
};

export default CustomAlert;