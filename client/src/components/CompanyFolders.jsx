// client/src/components/CompanyFolders.jsx
import React from "react";
import { FOLDERS } from "../data/data";
import CompanyFolder from "./CompanyFolder";

const CompanyFolders = () => {
  const handleAddFolder = () => {
    // TODO: Implement add folder functionality
    console.log("Add folder clicked");
    // You can add logic here to open a modal, show a form, etc.
  };

  return (
    <div className="flex flex-wrap gap-6">
      {FOLDERS.map((folder, index) => (
        <CompanyFolder
          key={index}
          company={folder.company}
          jobs={folder.jobs}
        />
      ))}
      <CompanyFolder variant="add" onClick={handleAddFolder} />
    </div>
  );
};

export default CompanyFolders;
