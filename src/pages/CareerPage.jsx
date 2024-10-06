import React from 'react';

const CareerPage = () => {
  const writerJobListings = [
    {
      title: 'Content Writer',
      location: 'Remote',
      description: 'We are looking for a creative Content Writer to produce engaging blog posts...',
      requirements: [
        'Proficiency in English grammar and style',
        'Experience in writing for digital platforms',
        'Ability to conduct thorough research',
      ],
    },
    {
      title: 'Technical Writer',
      location: 'On-site',
      description: 'Seeking a detail-oriented Technical Writer to create user manuals and guides...',
      requirements: [
        'Strong understanding of technical concepts',
        'Ability to work with engineering teams',
        'Experience with documentation tools',
      ],
    },
    {
      title: 'Copywriter',
      location: 'Remote',
      description: 'Looking for a persuasive Copywriter to craft compelling marketing copy...',
      requirements: [
        'Experience in advertising or marketing writing',
        'Ability to write engaging headlines and calls to action',
        'Strong understanding of branding and audience targeting',
      ],
    },
  ];

  const otherJobListings = [
    {
      title: 'Social Media Manager',
      location: 'Remote',
      description: 'We are looking for a creative Social Media Manager to enhance our online presence...',
      requirements: [
        'Experience with social media platforms',
        'Ability to create engaging content',
        'Strong analytical skills',
      ],
    },
    {
      title: 'SEO Specialist',
      location: 'On-site',
      description: 'Seeking an SEO Specialist to improve our website’s search engine rankings...',
      requirements: [
        'Proficiency in SEO tools and analytics',
        'Experience with content optimization',
        'Ability to develop SEO strategies',
      ],
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Careers at Our Company</h1>
      <p className="mb-6 text-center text-lg">
        Join our team and help us shape the future of technology! We are committed to creating an inclusive
        workplace where everyone can thrive.
      </p>
      
      <div className="mb-10">
        <h2 className="text-3xl font-semibold mb-6">Writer Positions</h2>
        {writerJobListings.length === 0 ? (
          <p>No writer positions available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writerJobListings.map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.location}</p>
                <p className="mt-3">{job.description}</p>
                <h4 className="mt-4 font-semibold">Requirements:</h4>
                <ul className="list-disc list-inside">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-6">Other Positions</h2>
        {otherJobListings.length === 0 ? (
          <p>No other positions available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherJobListings.map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.location}</p>
                <p className="mt-3">{job.description}</p>
                <h4 className="mt-4 font-semibold">Requirements:</h4>
                <ul className="list-disc list-inside">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">Why Work With Us?</h2>
      <p className="text-center">
        At our company, we believe in fostering a collaborative and dynamic work environment. Here are just a
        few reasons to join us:
      </p>
      <ul className="list-disc list-inside mt-4 mx-auto text-center">
        <li>Competitive salary and benefits package</li>
        <li>Flexible working hours and remote options</li>
        <li>Opportunities for professional development and growth</li>
        <li>A supportive and inclusive culture</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">How to Apply</h2>
      <p className="text-center">
        If you're excited about joining our team, please send your resume and cover letter to{' '}
        <a href="mailto:hr@ourcompany.com" className="text-blue-500 hover:underline">hr@ourcompany.com</a>. We look forward
        to hearing from you!
      </p>
    </div>
  );
};

export default CareerPage;
