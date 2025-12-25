import React from "react";

const Feature = ({ title, desc, icon }) => (
  <div className="flex flex-col gap-4">
    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);

const Features = () => {
  return (
    <section className="bg-secondary px-6 py-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <h2 className="font-serif text-4xl leading-tight text-gray-900 md:text-5xl">
            What you need, before you know you need it.
          </h2>
          <p className="mt-4 max-w-2xl text-gray-600">
            Hirewise learns your hiring patterns and surfaces the best
            candidates, automates repetitive workflows, and keeps candidate data
            secure — so you move faster without sacrificing quality.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            title="Smart Analytics"
            desc="Understand funnel conversion, time-to-hire and sourcing ROI with dashboards that update in real time."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 11V3m0 8l-4-4m4 4 4-4M3 21h18"
                />
              </svg>
            }
          />

          <Feature
            title="AI-Powered Match"
            desc="Automatically rank and recommend candidates based on role requirements and historical hiring success."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c0 1.657-1.343 3-3 3S6 12.657 6 11s1.343-3 3-3 3 1.343 3 3zM21 21l-6-6"
                />
              </svg>
            }
          />

          <Feature
            title="Seamless Workflows"
            desc="Automate outreach, interview scheduling, and offer management with configurable pipelines and templates."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7 7h10M7 17h10"
                />
              </svg>
            }
          />

          <Feature
            title="Security & Compliance"
            desc="Keep candidate data protected with role-based access, audit logs, and industry-standard encryption."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c1.657 0 3 .895 3 2v3H9v-3c0-1.105 1.343-2 3-2zM5 10V8a7 7 0 1114 0v2"
                />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
