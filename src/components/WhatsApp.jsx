import React from 'react'
import { FaWhatsapp } from 'react-icons/fa';

function WhatsApp() {
    return (
        <a
          href="https://wa.me/917359244428"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 bg-green-500 p-3 rounded-full text-white shadow-lg hover:bg-green-600 transition-colors"
        >
          <FaWhatsapp size={32} />
        </a>
      );
    };

export default WhatsApp