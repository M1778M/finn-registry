import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-32 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-12 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
            <Shield className="text-primary" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight mono-text uppercase">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

          <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">1. Introduction</h2>
              <p>
                At Finn Registry, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our package registry services. We are committed to protecting your personal data and your right to privacy in accordance with applicable data protection laws, including the GDPR and CCPA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">2. Information We Collect</h2>
              <div className="space-y-4">
                <p>
                  <strong className="text-foreground">Personal Identification Information:</strong> When you authenticate via GitHub, we receive your public profile information (username, avatar URL) and your email address. This is used solely for account management and identifying package ownership.
                </p>
                <p>
                  <strong className="text-foreground">Technical and Usage Data:</strong> We automatically collect information such as your IP address, browser type, operating system, and details about your interaction with the registry (e.g., package downloads, search queries). This data is used for security, performance optimization, and anonymous usage statistics.
                </p>
                <p>
                  <strong className="text-foreground">Authentication Data:</strong> We store cryptographically hashed versions of your API keys and session tokens. We never store plain-text secrets.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">3. Use of Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Essential Cookies:</strong> Necessary for authentication and security.</li>
                <li><strong className="text-foreground">Functional Cookies:</strong> Used to remember your preferences (e.g., theme settings).</li>
                <li><strong className="text-foreground">Analytics Cookies:</strong> Help us understand how the registry is being used.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">4. Data Sharing and Disclosure</h2>
              <p>
                We do not sell your personal data. We may share information with third-party service providers (like hosting platforms or authentication providers) only to the extent necessary to provide the registry services. We may also disclose data if required by law or to protect our legal rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">5. Your Data Protection Rights</h2>
              <p>
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to access, update or delete the information we have on you.</li>
                <li>The right of rectification (correcting inaccurate information).</li>
                <li>The right to object to or restrict processing of your data.</li>
                <li>The right to data portability.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">6. Data Security and Retention</h2>
              <p>
                We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure. We retain account data as long as your account exists. Published package versions and metadata are retained indefinitely to ensure build reproducibility for the ecosystem.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:legal@finn.sh" className="text-primary hover:underline">legal@finn.sh</a>.
              </p>
            </section>
          </div>
      </div>
    </div>
  );
}
