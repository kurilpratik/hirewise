import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // control dialog open state so we can close it programmatically
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

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
      location: formData.get("location"), // added
      experience: formData.get("experience"), // added
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

      // Success - reset form, close dialog and redirect to new job details
      e.target.reset();

      // try to get created id from response
      const newId =
        payload?.job?._id ||
        payload?.job?.id ||
        payload?._id ||
        payload?.id ||
        null;

      // close dialog
      setOpen(false);

      if (newId) {
        // navigate to job details page (adjust path if your route differs)
        navigate(`/jobs/${newId}`);
      } else {
        alert("Job created successfully.");
        console.log("Created job:", payload.job || payload);
      }
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
      <Dialog open={open} onOpenChange={setOpen}>
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
            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            {/* Title + Company in one row; Location + Experience in one row */}
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue=""
                    placeholder="City, Remote, or Office location"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    defaultValue=""
                    placeholder="e.g. 0-1 years, 2-4 years, Senior"
                  />
                </div>
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
