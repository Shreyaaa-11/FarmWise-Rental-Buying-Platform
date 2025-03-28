
import React from "react";
import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About FarmGear
              </h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Supporting farmers with quality equipment since 1985
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    FarmGear was founded in 1985 by John and Mary Smith, two farmers who saw a need for high-quality, affordable agricultural equipment in their community.
                  </p>
                  <p>
                    What started as a small shop selling basic farm tools has grown into a comprehensive agricultural equipment supplier, serving farmers across the country with both sales and rental options.
                  </p>
                  <p>
                    Our mission is to provide farmers with access to the tools they need to succeed, regardless of the size of their operation or their budget constraints.
                  </p>
                </div>
              </div>
              <div className="relative h-[400px] overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1589923188651-268a357a3e1a?q=80&w=800"
                  alt="Farmers with equipment"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Quality</h3>
                <p className="text-muted-foreground">
                  We only stock equipment from trusted manufacturers known for durability and performance.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  Our buy and rent options make quality equipment accessible to farms of all sizes.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Service</h3>
                <p className="text-muted-foreground">
                  Our knowledgeable staff provides expert advice and support for all your farming needs.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {["John Smith", "Mary Smith", "Robert Johnson", "Emily Davis"].map((name, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="h-40 w-40 rounded-full overflow-hidden mb-4">
                    <img
                      src={`https://i.pravatar.cc/300?img=${index + 1}`}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium">{name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {["Founder", "Co-Founder", "Sales Manager", "Customer Support"][index]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-lg text-center">
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-6">
                Have questions about our products or services? Our team is here to help!
              </p>
              <div className="space-y-4">
                <p><strong>Email:</strong> info@farmgear.com</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Location:</strong> 1234 Farm Road, Rural County, USA</p>
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
                &copy; {new Date().getFullYear()} FarmGear. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
