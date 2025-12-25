import React from "react";

const Footer = () => {
  return (
    <footer className="bg-base w-full px-6 py-20 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Left: Heading */}
        <div>
          <h2 className="text-5xl font-semibold tracking-tight md:text-6xl">
            Contact us
          </h2>
        </div>

        {/* Right: Content */}
        <div className="space-y-12">
          {/* Description */}
          <p className="max-w-md text-sm leading-relaxed text-neutral-600">
            If you have questions or need any general information, please
            complete this form to request the information you need. It will be
            an honor to help you.
          </p>

          <hr className="border-neutral-200" />

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-12 text-sm sm:grid-cols-2">
            {/* General Enquiries */}
            <div className="space-y-4">
              <h4 className="text-xs tracking-wider text-neutral-500 uppercase">
                General Enquiries
              </h4>

              <div className="space-y-1 text-neutral-700">
                <p className="font-medium">Pratik Kuril</p>
                <p>Full Stack Developer</p>
                <p>Advisor & Product Specialist</p>
              </div>

              <div className="space-y-1 pt-4 text-neutral-700">
                <p>Phone</p>
                <a href="#" className="hover:underline">
                  +42 55 231 5322
                </a>
              </div>

              <div className="space-y-1 pt-2 text-neutral-700">
                <p>Email</p>
                <a
                  href="mailto:pratikkurilworks@gmail.com"
                  className="hover:underline"
                >
                  pratikkurilworks@gmail.com
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-xs tracking-wider text-neutral-500 uppercase">
                Social Media
              </h4>

              <ul className="space-y-2 text-neutral-700">
                <li>
                  <a href="#" className="hover:underline">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
