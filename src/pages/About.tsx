import React from "react";
import Navbar from "@/components/Navbar";
import { useTranslation } from "@/contexts/TranslationContext";

const About = () => {
  const { translate } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {translate("About FarmWise")}
              </h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                {translate("Supporting farmers with quality equipment since 2025")}
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">{translate("Our Story")}</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    {translate("FarmWise was founded in 2025 by a team of passionate engineering students: Sharadhi Hegde, Shravya R, Shreya S, and Sindhu K V, who all envisioned a world where technology truly empowered the farming community.")}
                  </p>
                  <p>
                    {translate("The idea of FarmWise was born while discussing various issues that farmers face when trying to make a living, mostly in rural areas-leveling of the land and high costs, and lack of a reliable platform for rentals. Coming from very different backgrounds but one common purpose, set to build something simple, accessible, and truly impactful for the farmers.")}
                  </p>
                  <p>
                    {translate("Through the application, farmers rent or buy equipment, get multilingual AI-driven support (including Kannada), and leverage real-time information.")}
                  </p>
                  <p>
                    {translate("We aim to utilize full-stack technology and AI to make farming smarter, efficient, and affordable-for small and marginal farmers in particular. At FarmWise, we strongly believe in innovation being inclusive and intend to impact real-world change at the very foundation of our economy-agriculture.")}
                  </p>
                </div>
              </div>
              <div className="relative h-[400px] overflow-hidden rounded-lg">
                <img
                  src="/farmers-in-field.jpg"
                  alt={translate("Farmers with equipment")}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">{translate("Our Values")}</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{translate("Quality")}</h3>
                <p className="text-muted-foreground">
                  {translate("We only stock equipment from trusted manufacturers known for durability and performance.")}
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{translate("Accessibility")}</h3>
                <p className="text-muted-foreground">
                  {translate("Our buy and rent options make quality equipment accessible to farms of all sizes.")}
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{translate("Service")}</h3>
                <p className="text-muted-foreground">
                  {translate("Our knowledgeable staff provides expert advice and support for all your farming needs.")}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">{translate("Our Team")}</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                { name: translate("Sharadhi Hegde") /*, role: translate("Founder") */, avatarSeed: "Eden" },
                { name: translate("Shravya R") /*, role: translate("Co-Founder") */, avatarSeed: "Caleb" },
                { name: translate("Shreya S") /*, role: translate("Sales Manager") */, avatarSeed: "Oliver" },
                { name: translate("Sindhu K V") /*, role: translate("Customer Support") */, avatarSeed: "Easton" }
              ].map((person, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="h-40 w-40 rounded-full overflow-hidden mb-4">
                    <img
                      src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${person.avatarSeed}&backgroundColor=4f46e5&radius=50`}
                      alt={person.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium">{person.name}</h3>
                  {/* <p className="text-sm text-muted-foreground">{person.role}</p> */}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-lg text-center">
              <h2 className="text-3xl font-bold mb-4">{translate("Contact Us")}</h2>
              <p className="text-muted-foreground mb-6">
                {translate("Have questions about our products or services? Our team is here to help!")}
              </p>
              <div className="space-y-4">
                <p><strong>{translate("Email")}:</strong> info@farmwise.in</p>
                <p><strong>{translate("Phone")}:</strong> +91 98765 43210</p>
                <p><strong>{translate("Location")}:</strong> {translate("Bangalore, Karnataka, India")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t bg-background">
        <div className="container px-4 py-8 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} {translate("FarmWise. All rights reserved.")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
