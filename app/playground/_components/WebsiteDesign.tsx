"use client"
import React, { useEffect, useRef } from 'react'

type Props = {
  generatedCode: string
}

const WebsiteDesign = ({ generatedCode }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. Initialize iframe shell (Load Libraries only ONCE)
  useEffect(() => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    
    if (!doc) return;

    // Check if head is already populated to avoid re-writing on re-renders
    if (doc.head.children.length > 0) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>AI Generated Website</title>

          <script src="https://cdn.tailwindcss.com"></script>

          <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
          
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

          <style>
            /* Custom Scrollbar for the preview */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #f1f1f1; }
            ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #555; }
            body { padding: 10px; } 
          </style>
      </head>
      <body id="preview-root" class="bg-white min-h-screen">
        </body>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
      </html>
    `);
    doc.close();
  }, []); // Run only once on mount

  // 2. Update body content whenever generatedCode changes
  useEffect(() => {
    if (!iframeRef.current || !generatedCode) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const root = doc.getElementById("preview-root");
    if (root) {
      // Clean up the markdown code blocks if present
      const cleanCode = generatedCode
        .replace(/```html/g, "")
        .replace(/```/g, "");

      root.innerHTML = cleanCode;
      
      // Optional: Re-initialize Flowbite components if they are dynamic (like carousels/modals)
      // This is a safe way to tell Flowbite to look for new elements
      try {
        //@ts-ignore
        if (doc.defaultView && doc.defaultView.initFlowbite) {
           //@ts-ignore
           doc.defaultView.initFlowbite();
        }
      } catch (e) {
        // Flowbite might not be loaded yet, which is fine
      }
    }
  }, [generatedCode]);

  return (
    <div className="flex-1 h-[91vh] overflow-hidden p-2 bg-gray-100">
      <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <iframe
          ref={iframeRef}
          title="Website Preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  )
}

export default WebsiteDesign