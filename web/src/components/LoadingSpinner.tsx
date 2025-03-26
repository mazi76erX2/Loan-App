import React from "react";
import "../App.css";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner" data-testid="loading-spinner">
      <div className="loading-spinner-loader"></div>
    </div>
  );
};
