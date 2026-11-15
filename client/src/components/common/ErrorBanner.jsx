import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Reusable accessible error banner for deep-space telemetry and API errors
 * @param {Object} props
 * @param {string} [props.title='Telemetry Communication Error'] - Error heading
 * @param {string} [props.message] - Detailed error message
 * @param {Function} [props.onRetry] - Optional retry handler
 * @param {string} [props.retryLabel='Retry Telemetry Link'] - Retry button text
 * @param {string} [props.className] - Optional custom styling classes
 */
export default function ErrorBanner({
  title = 'Telemetry Communication Error',
  message = 'Unable to establish link with deep space archives. Please check network connection.',
  onRetry,
  retryLabel = 'Retry Telemetry Link',
  className = ''
}) {
  return (
    <div
      role="alert"
      className={`glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 text-center max-w-lg mx-auto my-8 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/40">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="font-heading font-bold text-lg text-white mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#A99BBF] mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-violet inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs shadow-violet-glow focus-ring transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
}
