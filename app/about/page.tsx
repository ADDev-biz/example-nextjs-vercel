import PageWrapper from "../components/PageWrapper";

export default function AboutPage() {
  return (
    <PageWrapper
      title="About Us"
      description="Learn more about our company and mission"
      className="bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-base-content mb-4">
              Our Story
            </h2>
            <p className="text-base-content/80 mb-6">
              We are a passionate team dedicated to creating amazing web
              experiences. Our mission is to build innovative solutions that
              make a difference in people's lives.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Innovation-driven development</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>User-centered design</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Cutting-edge technology</span>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Get in Touch</h3>
              <p>Ready to start your next project?</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Contact Us</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-base-content mb-6">
            Our Team
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <div className="avatar placeholder mb-4">
                    <div className="bg-primary text-primary-content rounded-full w-16">
                      <span className="text-xl">U{i}</span>
                    </div>
                  </div>
                  <h4 className="card-title justify-center">User {i}</h4>
                  <p className="text-base-content/70">
                    Full Stack Developer
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
