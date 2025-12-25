import React from "react";
import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import CompanyFolder from "./CompanyFolder";
import { Textarea } from "./ui/textarea";
import { Sparkles } from "lucide-react";

const AddJob = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // set backend base URL via Vite env var (create .env with VITE_API_URL) or fallback
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleAddFolder = () => {
    console.log("Add folder clicked");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);
    const jobData = {
      title: formData.get("title"),
      company: formData.get("company"),
      description: formData.get("description"),
    };

    // Basic client-side validation
    if (!jobData.title || !jobData.company || !jobData.description) {
      setError("Title, company and description are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      const payload = await res.json();

      if (!res.ok) {
        const msg = payload?.message || "Failed to create job";
        const details = payload?.errors ? `: ${payload.errors.join(", ")}` : "";
        throw new Error(msg + details);
      }

      // Success - reset form and give feedback
      e.target.reset();
      alert("Job created successfully.");
      console.log("Created job:", payload.job || payload);
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }

    // console.log("Job Data:", jobData);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <CompanyFolder variant="add" onClick={handleAddFolder} />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader className={"mb-8"}>
              <DialogTitle className={"text-2xl"}>Add Job</DialogTitle>
              <DialogDescription className={"max-w-[60%]"}>
                Add a job position, enter the job description or load one using
                AI
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue=""
                  placeholder="Job Title"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  defaultValue=""
                  placeholder="Company Name"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter the job description manually or load one using AI"
                  required
                  className={"mb-6 h-40"}
                />
              </div>
            </div>
            <DialogFooter>
              {/* <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose> */}
              <Button variant="outline">
                Load JD <Sparkles />
              </Button>
              <Button type="submit">Add Job</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddJob;
