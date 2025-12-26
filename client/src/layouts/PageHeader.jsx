import React from "react";

const PageHeader = ({ children }) => {
  return (
    <header className="sticky inset-0 top-0 z-20 w-full bg-white px-8 pb-4">
      {children}
    </header>
  );
};

export default PageHeader;
