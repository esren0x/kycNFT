import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              API Documentation
            </h1>
            <p className="text-xl text-gray-600">
              Integrate KYC verification into your Aleo application with our
              simple API endpoints.
            </p>
          </div>

          {/* Authentication Section */}
          <section className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
            <p className="text-gray-600 mb-4">
              All API requests require an API key to be included in the header.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-800">
                <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
              </pre>
            </div>
          </section>

          {/* Endpoints Section */}
          <section className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>

            {/* Verify Wallet Endpoint */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                  GET
                </span>
                <code className="text-primary-600">/api/verify</code>
              </div>

              <h3 className="text-xl font-medium mb-4">
                Verify Wallet KYC Status
              </h3>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Query Parameters</h4>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Parameter</th>
                      <th className="text-left py-2 px-4">Type</th>
                      <th className="text-left py-2 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4">
                        <code>wallet</code>
                      </td>
                      <td className="py-2 px-4">string</td>
                      <td className="py-2 px-4">
                        Aleo wallet address to verify
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Example Request</h4>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre>
                    <code>{`curl -X GET "https://kyc-nft.vercel.app/api/verify?wallet=aleo1..." \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                  </pre>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Example Response</h4>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <pre>
                    <code>{`{
  "verified": true,
  "expirationBlock": 123456,
  "ownerId": "abc123..."
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Response Schema</h4>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Field</th>
                      <th className="text-left py-2 px-4">Type</th>
                      <th className="text-left py-2 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4">
                        <code>verified</code>
                      </td>
                      <td className="py-2 px-4">boolean</td>
                      <td className="py-2 px-4">
                        Whether the wallet has valid KYC verification
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">
                        <code>expirationBlock</code>
                      </td>
                      <td className="py-2 px-4">number</td>
                      <td className="py-2 px-4">
                        Block number when the KYC verification expires
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">
                        <code>ownerId</code>
                      </td>
                      <td className="py-2 px-4">string</td>
                      <td className="py-2 px-4">
                        Unique identifier of the KYC verification
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Error Handling Section */}
          <section className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
            <p className="text-gray-600 mb-4">
              The API uses conventional HTTP response codes to indicate the
              success or failure of requests.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Code</th>
                  <th className="text-left py-2 px-4">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">
                    <code>200</code>
                  </td>
                  <td className="py-2 px-4">Success</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">
                    <code>400</code>
                  </td>
                  <td className="py-2 px-4">
                    Bad Request - Invalid wallet address
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">
                    <code>401</code>
                  </td>
                  <td className="py-2 px-4">Unauthorized - Invalid API key</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">
                    <code>404</code>
                  </td>
                  <td className="py-2 px-4">Not Found - Wallet not found</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">
                    <code>500</code>
                  </td>
                  <td className="py-2 px-4">Internal Server Error</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Support Section */}
          <section className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              If you need assistance integrating our API or have any questions,
              please don't hesitate to reach out to our support team.
            </p>
            <Link
              href="mailto:support@kyc-nft.com"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Contact Support
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
