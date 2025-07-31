import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text = null, 
  center = true,
  className = '' 
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
    '2xl': 'h-16 w-16'
  };

  // Color classes
  const colorClasses = {
    blue: 'border-blue-600',
    red: 'border-red-600',
    green: 'border-green-600',
    yellow: 'border-yellow-600',
    purple: 'border-purple-600',
    pink: 'border-pink-600',
    indigo: 'border-indigo-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  // Text size classes
  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl'
  };

  const spinnerClasses = `
    animate-spin rounded-full border-2 border-t-transparent
    ${sizeClasses[size]} 
    ${colorClasses[color]}
    ${className}
  `.trim();

  const containerClasses = `
    ${center ? 'flex items-center justify-center' : 'inline-flex items-center'}
    ${text ? 'space-x-3' : ''}
  `.trim();

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

// Specific spinner variants for common use cases
export const ButtonSpinner = ({ className = '' }) => (
  <LoadingSpinner 
    size="sm" 
    color="white" 
    center={false}
    className={`mr-2 ${className}`}
  />
);

export const PageSpinner = ({ text = 'Loading...' }) => (
  <div className="min-h-64 flex items-center justify-center">
    <LoadingSpinner 
      size="xl" 
      color="blue" 
      text={text}
    />
  </div>
);

export const TableSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <LoadingSpinner 
      size="lg" 
      color="blue" 
      text="Loading data..."
    />
  </div>
);

export const CardSpinner = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center p-6">
    <LoadingSpinner 
      size="md" 
      color="blue" 
      text={text}
    />
  </div>
);

export const OverlaySpinner = ({ text = 'Loading...' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 shadow-xl">
      <LoadingSpinner 
        size="lg" 
        color="blue" 
        text={text}
      />
    </div>
  </div>
);

export const InlineSpinner = ({ size = 'sm', color = 'blue', className = '' }) => (
  <LoadingSpinner 
    size={size}
    color={color}
    center={false}
    className={`inline-block ${className}`}
  />
);

export default LoadingSpinner;
