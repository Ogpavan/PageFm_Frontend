import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="w-full flex items-center justify-center">
    <div className="md:w-1/2 p-6">
      <h1 className="text-3xl font-bold mb-4">PageFM Terms and Conditions</h1>
      <p>
        Welcome to PageFM! These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using PageFM, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please do not use our platform.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">1. User-Generated Content</h2>
      <p>
        PageFM allows users to upload, publish, and share content such as text, images, audio, and other materials ("User Content"). By submitting content, you agree to the following:
      </p>
      <ul className="list-disc ml-6 mt-2">
        <li>You are solely responsible for the content you upload, share, or otherwise make available on PageFM.</li>
        <li>PageFM shall not be liable for any damages, losses, or issues arising from content you upload to the platform.</li>
        <li>PageFM reserves the right, but is not obligated, to remove or disable access to any User Content that violates these Terms or applicable laws.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. User Conduct</h2>
      <p>
        By using PageFM, you agree that you will not upload or share content that is illegal, offensive, or harmful, among other restrictions.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Intellectual Property</h2>
      <p>More details on content rights and platform ownership.</p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Limitation of Liability</h2>
      <p>
        PageFM will not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Privacy Policy</h2>
      <p>
        Please review our <a href="/privacy-policy" className="text-blue-500">Privacy Policy</a> to understand how we collect, use, and protect your personal information.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Governing Law</h2>
      <p>These Terms are governed by the laws of [Your Jurisdiction].</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Contact Information</h2>
      <p>If you have any questions, please contact us at support@pagefm.com.</p>
    </div>
    </div>
  );
};

export default TermsAndConditions;
