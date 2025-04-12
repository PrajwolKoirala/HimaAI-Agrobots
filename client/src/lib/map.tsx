import React, { JSX } from 'react';
import dynamic from 'next/dynamic';

export const GoogleMap = dynamic(
  () => {
    return Promise.resolve(() => (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2584830669373!2d85.3128!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19c34d0e3d07%3A0x27a3e5123a0d1e3!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2s!4v1629789145678!5m2!1sen!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
      />
    ));
  },
  { ssr: false } // This ensures the component only renders on the client side
);