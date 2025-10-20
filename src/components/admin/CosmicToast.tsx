import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface CosmicToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastColors = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

export default function CosmicToast({ type, message, onClose }: CosmicToastProps) {
  const Icon = toastIcons[type];
  const color = toastColors[type];
  
  return (
    <motion.div
      className="cosmic-toast"
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.05 }}
      onClick={onClose}
    >
      <div className="flex items-start">
        <Icon className={`h-5 w-5 mr-2 mt-0.5 ${color}`} />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button className="ml-4 inline-flex text-gray-400 hover:text-white">
          <span className="sr-only">Close</span>
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}