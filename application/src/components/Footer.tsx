export const Footer = () => (
  <footer className="bg-white border-t">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            About Aleo KYC
          </h3>
          <p className="text-gray-600">
            Secure and compliant identity verification for the Aleo ecosystem.
          </p>
        </div>
        <div></div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
          <p className="text-gray-600">
            Need help? Contact our support team at support@aleokyc.com
          </p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t text-center text-gray-600">
        <p>© 2025 Aleo KYC. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
