'use client';

import { useEffect } from 'react';

// declare global {
//   interface Window {
//     clarity: any;
//   }
// }

export function Clarity({ clarityId }: { clarityId: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && clarityId) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.text = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `;
      document.head.appendChild(script);
    }
  }, [clarityId]);

  return null;
}