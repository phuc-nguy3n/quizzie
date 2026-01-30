import React from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <nav>Dashboard Nav</nav>
      {children}
    </div>
  );
};

export default DashboardLayout;