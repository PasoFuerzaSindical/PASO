import React from 'react';

const Loader: React.FC<{ text?: string }> = ({ text = "Procesando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ugt-green"></div>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};

export default Loader;