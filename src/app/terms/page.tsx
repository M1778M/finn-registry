import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            <Scale className="text-primary" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight mono-text uppercase">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

          <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Finn Registry ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms constitute a legally binding agreement between you and Finn Foundation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">2. Use of the Service</h2>
              <div className="space-y-4">
                <p>
                  <strong className="text-foreground">Eligibility:</strong> You must be at least 13 years of age to use this Service. By using the Service, you represent and warrant that you meet this requirement.
                </p>
                <p>
                  <strong className="text-foreground">Account Security:</strong> You are responsible for maintaining the confidentiality of your API keys and session tokens. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">3. Package Distribution and Intellectual Property</h2>
              <div className="space-y-4">
                <p>
                  <strong className="text-foreground">License Grant:</strong> By publishing a package, you grant Finn Registry a non-exclusive, worldwide, royalty-free license to host, distribute, and display your package.
                </p>
                <p>
                  <strong className="text-foreground">Immutability:</strong> To maintain the integrity of the ecosystem, published package versions are immutable. You acknowledge that you cannot delete or modify a version once it is published, except in rare cases of legal compliance or critical security issues as determined by the registry maintainers.
                </p>
                <p>
                  <strong className="text-foreground">Ownership:</strong> You retain all ownership rights to the code you publish, subject to the license you provide.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">4. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Distribute malware, spyware, or any malicious code.</li>
                <li>Engage in name-squatting or intentional package confusion (typosquatting).</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts.</li>
                <li>Use the Service for any illegal purpose or in violation of any local, state, national, or international law.</li>
                <li>Reverse engineer or attempt to extract the source code of the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">5. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, the Service, or third parties, or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">6. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">7. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FINN FOUNDATION SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">8. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Finn Foundation is registered, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mono-text uppercase tracking-tight">9. Contact</h2>
              <p>
                Questions about the Terms of Service should be sent to <a href="mailto:legal@finn.sh" className="text-primary hover:underline">legal@finn.sh</a>.
              </p>
            </section>
          </div>
      </div>
    </div>
  );
}
