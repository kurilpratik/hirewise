import React from "react";
import CTAButtons from "./CTAButtons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Hero = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <p className="text-xs tracking-widest text-slate-500 uppercase">
          Welcome to HireWise
        </p>

        <h1 className="font-faustina mt-2 text-5xl leading-tight text-slate-900 md:text-7xl">
          Stop Reading Resumes. Start <span className="italic">Finding</span>{" "}
          Talent.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-700">
          Match candidates to jobs in seconds using intelligent resume analysis
          and conversational AI
        </p>

        <CTAButtons />

        {/* <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
            <Avatar>
              <AvatarImage
                className="object-cover"
                src="https://images.pexels.com/photos/8528744/pexels-photo-8528744.jpeg"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                className="object-cover"
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                className="object-cover"
                src="https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-sm text-slate-600">
            ★ Rated 4.97/5 from 500+ reviews
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
