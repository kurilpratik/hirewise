// client/src/components/CompanyFolders.jsx
import React from "react";
import { FOLDERS } from "../data/data";
import CompanyFolder from "./CompanyFolder";
import AddJob from "./AddJob";

const CompanyFolders = () => {
  return (
    <div className="flex flex-wrap gap-6">
      {FOLDERS.map((folder, index) => (
        <CompanyFolder
          key={index}
          company={folder.company}
          jobs={folder.jobs}
        />
      ))}
      <AddJob />
    </div>
  );
};

export default CompanyFolders;
