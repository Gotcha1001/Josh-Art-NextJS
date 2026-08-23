"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function DataProtectionPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold">Data Protection Policy</h1>
        <p className="mt-2 text-muted-foreground">
          <strong>January 2022</strong>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <Card className="mb-6">
          <CardContent>
            <p className="text-muted-foreground">
              Joshes Art is committed to protecting personal data and respecting
              the rights of our data subjects (people whose personal data we
              collect and use). Joshes Art values the personal information
              entrusted to us and we respect that trust by complying with all
              relevant laws, particularly the Protection of Personal Information
              Act (POPIA) in South Africa.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="mb-6">
          <CardContent>
            <h2 className="mb-2 text-2xl font-semibold">
              Purpose of Data Processing
            </h2>
            <p className="text-muted-foreground">
              We process personal data to help us:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Maintain a database of our customers</li>
              <li>Provide customer support and services</li>
              <li>Improve our products and services</li>
              <li>Manage business accounts and records</li>
              <li>Promote our services</li>
              <li>
                Respond effectively to inquiries and handle any complaints
              </li>
              <li>
                For marketing and promotional events that might require this
                information
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card className="mb-6">
          <CardContent>
            <h2 className="mb-2 text-2xl font-semibold">
              Approval and Compliance
            </h2>
            <p className="text-muted-foreground">
              This policy has been approved by the Joshes Art Leadership Team
              who are responsible for ensuring that we comply with all our legal
              obligations. It sets out the legal rules that apply whenever we
              gather, process, store, or use personal data.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="mb-6">
          <CardContent>
            <h2 className="mb-2 text-2xl font-semibold">
              Why This Policy Is Important
            </h2>
            <p className="text-muted-foreground">
              <strong>A.</strong> We are committed to protecting personal data
              from being misused, getting into the wrong hands because of poor
              security, being shared carelessly, or being inaccurate.
              <br />
              <strong>B.</strong> This policy sets out the measures we are
              committed to taking as a business and what each of us will do to
              ensure we comply with the relevant legislation.
              <br />
              <strong>C.</strong> For instance, we will make sure that all
              personal data is:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Processed lawfully, fairly, and transparently</li>
              <li>
                Processed for specific and legitimate purposes and not in a
                manner that is incompatible with those purposes
              </li>
              <li>
                Adequate, relevant, and limited to what is necessary for the
                purposes for which it is being processed
              </li>
              <li>Accurate, complete, and up to date</li>
              <li>
                Not kept longer than necessary for the purposes for which it is
                being processed
              </li>
              <li>
                Processed in a secure manner, by using appropriate technical and
                organizational means
              </li>
              <li>
                Processed in keeping with the rights of data subjects regarding
                personal data
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <Card className="mb-6">
          <CardContent>
            <h2 className="mb-2 text-2xl font-semibold">Policy Application</h2>
            <p className="text-muted-foreground">
              <strong>A.</strong> As an employee or volunteer processing
              personal information on behalf of the business, you are required
              to comply with this policy. If you think that you have
              accidentally breached the policy, it is important that you contact
              our Information Officer immediately so that we can take action to
              limit the impact of the breach. Anyone who breaches the Data
              Protection Policy may be subject to disciplinary action, and where
              that individual has breached the policy intentionally, recklessly,
              or for personal benefit they may also be liable for prosecution or
              to regulatory action.
              <br />
              <strong>B.</strong> As a leader and/or manager, you are required
              to make sure that any procedures that involve personal data, which
              you are responsible for in your area, follow the rules set out in
              this Data Protection Policy.
              <br />
              <strong>C.</strong> As a data subject of Joshes Art, you can be
              assured that we will handle your personal information in line with
              this policy.
              <br />
              <strong>D.</strong> As an appointed data processor/contractor, you
              are required to comply with this policy under the contract with
              us. Any breach of this policy will be taken seriously and could
              lead to us taking contract enforcement action against the company
              or terminating the contract.
              <br />
              <strong>E.</strong> Our Information Officer is responsible for
              advising Joshes Art and its staff about their legal obligations
              under data protection law, monitoring compliance with data
              protection law, dealing with data security breaches, and the
              development of this policy. Any questions about this policy or any
              concerns that the policy has not been followed should be referred
              to them at:{" "}
              <a
                href="mailto:info@joshesart.com"
                className="font-medium text-primary hover:underline"
              >
                info@joshesart.com
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="mb-6">
          <CardContent>
            <h2 className="mb-2 text-2xl font-semibold">
              Website, Cookies, and Marketing
            </h2>
            <p className="text-muted-foreground">
              <strong>A.</strong> We believe that transparency is important when
              dealing with data subjects and their personal information.
              Therefore, our website collects personal information in a manner
              that complies with applicable data protection laws.
              <br />
              <strong>B.</strong> The Joshes Art Data Protection Policy document
              is available on the website for data subjects to review should
              they need to know how their data is processed within each
              department and by each service provider of the business.
            </p>
            <p className="mt-4 text-muted-foreground">
              We will seek consent from all existing customers to reaffirm the
              business&rsquo;s undertaking to continue to process any personal
              information in its possession lawfully and securely in terms of
              applicable data protection laws.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <Card className="mb-6">
          <CardContent>
            <h2 className="mb-2 text-2xl font-semibold">
              Cybersecurity &amp; Data Breach Protection
            </h2>
            <p className="text-muted-foreground">
              <strong>A.</strong> All personal data collected, stored, and
              processed by Joshes Art is done within a compliant framework –
              accompanied by the necessary consent from all customers, visitors,
              or staff (to have their data processed).
              <br />
              <strong>B.</strong> Please note that Joshes Art deals with
              personal information, and we ensure that our internal practices
              are backed up by written policy or secure procedure which promotes
              secure and lawful processing of personal information at all times.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="mb-6">
          <CardContent>
            <h2 className="mb-2 text-2xl font-semibold">
              Policy and Procedures
            </h2>
            <p className="text-muted-foreground">
              This policy ensures that all employees/volunteers understand data
              protection rules and policies within their duties.
              Employees/volunteers are reminded that all personal information
              must be stored securely.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
      >
        <Card className="mb-6">
          <CardContent>
            <h2 className="mb-4 text-2xl font-semibold">Signatures</h2>
            <p className="mb-4 text-muted-foreground">Approved by:</p>

            <div className="mb-6">
              <div className="relative h-24 w-48">
                <Image
                  src="/josh-harman1.jpg"
                  alt="Joshua Harman's Signature"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="mt-1 font-medium">JOSHUA HARMAN</p>
            </div>

            <div>
              <div className="relative h-24 w-48">
                <Image
                  src="/Lindo-Mdima1.jpg"
                  alt="Lindo Mdima's Signature"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="mt-1 font-medium">LINDO MDIMA</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
