"use client"
import React, { useEffect, useRef } from 'react'
import { PreviewMode } from '../[projectId]/page'

type Props = {
  generatedCode: string;
  setGeneratedCode: (code: string) => void;
  previewMode: PreviewMode;
}

const PREVIEW_WIDTHS: Record<PreviewMode, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

const WebsiteDesign = ({ generatedCode, setGeneratedCode, previewMode }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ignoreNextRender = useRef<boolean>(false);

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

          <script src="https://cdn.tailwindcss.com"><\/script>

          <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
          
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

          <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"><\/script>

          <style>
            /* Custom Scrollbar for the preview */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #f1f1f1; }
            ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #555; }
            body { padding: 10px; } 

            /* Element Selection Outline */
            .ai-hovered-element {
              outline: 2px dashed #3b82f6 !important;
              outline-offset: 2px;
              cursor: pointer !important;
            }
            .ai-selected-element {
              outline: 2.5px solid #2563eb !important;
              outline-offset: 2px;
              cursor: pointer !important;
              box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15) !important;
            }
            /* Smooth visual transitions for style edits */
            * {
              transition: background-color 0.15s ease, color 0.15s ease, font-size 0.15s ease,
                          padding 0.15s ease, margin 0.15s ease, border-radius 0.15s ease,
                          box-shadow 0.15s ease, opacity 0.15s ease;
            }
          </style>
      </head>
      <body id="preview-root" class="bg-white min-h-screen">
      </body>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"><\/script>
      <script>
        // Counter for assigning stable IDs to elements
        var aiIdCounter = 0;

        function assignAiId(el) {
          if (!el.hasAttribute('data-ai-id')) {
            el.setAttribute('data-ai-id', 'ai-el-' + (aiIdCounter++));
          }
          return el.getAttribute('data-ai-id');
        }

        // Assign IDs to all elements when content loads
        function assignAllIds() {
          var allElements = document.querySelectorAll('#preview-root *');
          allElements.forEach(function(el) { assignAiId(el); });
        }

        // Watch for new content being injected
        var observer = new MutationObserver(function() {
          assignAllIds();
        });
        observer.observe(document.getElementById('preview-root') || document.body, {
          childList: true, subtree: true
        });

        document.addEventListener('mouseover', function(e) {
          e.stopPropagation();
          if (e.target.id !== 'preview-root') {
            e.target.classList.add('ai-hovered-element');
          }
        });
        document.addEventListener('mouseout', function(e) {
          e.stopPropagation();
          e.target.classList.remove('ai-hovered-element');
        });

        // Track currently selected element reference
        var currentSelectedEl = null;

        document.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // Remove previous selection highlight
          if (currentSelectedEl) {
            currentSelectedEl.classList.remove('ai-selected-element');
          }
          
          // Remove hover highlight
          e.target.classList.remove('ai-hovered-element');
          
          // Assign a stable ID to this element
          var aiId = assignAiId(e.target);
          
          // Capture computed styles
          var cs = window.getComputedStyle(e.target);
          
          var elementData = {
            tagName: e.target.tagName,
            className: e.target.className || '',
            innerText: e.target.childNodes.length === 1 && e.target.childNodes[0].nodeType === 3
                       ? e.target.textContent || ''
                       : e.target.innerText || '',
            src: e.target.src || '',
            href: e.target.href || '',
            alt: e.target.alt || '',
            selector: '[data-ai-id="' + aiId + '"]',
            // Computed style properties
            backgroundColor: cs.backgroundColor,
            color: cs.color,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            paddingTop: cs.paddingTop,
            paddingRight: cs.paddingRight,
            paddingBottom: cs.paddingBottom,
            paddingLeft: cs.paddingLeft,
            marginTop: cs.marginTop,
            marginRight: cs.marginRight,
            marginBottom: cs.marginBottom,
            marginLeft: cs.marginLeft,
            borderRadius: cs.borderRadius,
            boxShadow: cs.boxShadow,
            opacity: cs.opacity,
            textAlign: cs.textAlign,
          };
          
          // Add selected outline
          if (e.target.id !== 'preview-root') {
            e.target.classList.add('ai-selected-element');
            currentSelectedEl = e.target;
          }
          
          // Send message to parent
          window.parent.postMessage({
            type: 'ELEMENT_SELECTED',
            payload: elementData
          }, '*');
        });

        // Listen for updates from parent
        window.addEventListener('message', function(event) {
          if (event.data && event.data.type === 'UPDATE_ELEMENT') {
            var selector = event.data.payload.selector;
            var updates = event.data.payload.updates;
            if (!selector) return;
            
            // Find the element using the data-ai-id selector
            var el = document.querySelector(selector);
            if (!el) return;
            
            var isContentChange = false;

            // Apply content updates
            if (updates.innerText !== undefined) {
              el.innerText = updates.innerText;
              isContentChange = true;
            }
            if (updates.src !== undefined) {
              el.src = updates.src;
              isContentChange = true;
            }
            if (updates.href !== undefined) {
              el.href = updates.href;
              isContentChange = true;
            }
            if (updates.alt !== undefined) {
              el.alt = updates.alt;
              isContentChange = true;
            }

            // Apply style updates directly to element
            var styleProps = [
              'backgroundColor', 'color', 'fontSize', 'fontWeight',
              'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
              'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
              'borderRadius', 'boxShadow', 'opacity', 'textAlign'
            ];
            styleProps.forEach(function(prop) {
              if (updates[prop] !== undefined) {
                el.style[prop] = updates[prop];
              }
            });
            
            // Only sync HTML back to parent for content changes
            // (style changes persist as inline styles in the DOM and don't need a full re-sync
            //  which would cause a re-render loop wiping the inline styles)
            if (isContentChange) {
              var root = document.getElementById('preview-root');
              if (root) {
                // Temporarily remove selection classes so they aren't saved
                var selected = root.querySelectorAll('.ai-selected-element, .ai-hovered-element');
                selected.forEach(function(node) {
                  node.classList.remove('ai-selected-element', 'ai-hovered-element');
                });
                
                window.parent.postMessage({
                  type: 'STATE_UPDATED',
                  payload: root.innerHTML
                }, '*');
                
                // Add back selection
                el.classList.add('ai-selected-element');
              }
            }
          }
        });
      <\/script>
      </html>
    `);
    doc.close();
  }, []); // Run only once on mount

  // 2. Update body content whenever generatedCode changes
  useEffect(() => {
    if (!iframeRef.current || !generatedCode) return;
    
    // Skip if this change was triggered by our own iframe edit
    if (ignoreNextRender.current) {
        ignoreNextRender.current = false;
        return;
    }

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const root = doc.getElementById("preview-root");
    if (root) {
      // Clean up the markdown code blocks if present
      const cleanCode = generatedCode
        .replace(/\`\`\`html/g, "")
        .replace(/\`\`\`/g, "");

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

  // 3. Listen for STATE_UPDATED messages from our iframe
  useEffect(() => {
     const handleStateUpdate = (event: MessageEvent) => {
        if (event.data?.type === 'STATE_UPDATED') {
           ignoreNextRender.current = true;
           setGeneratedCode(event.data.payload);
        }
     };
     window.addEventListener('message', handleStateUpdate);
     return () => window.removeEventListener('message', handleStateUpdate);
  }, [setGeneratedCode]);

  return (
    <div className="flex-1 h-[91vh] overflow-hidden p-2 bg-gray-100 flex items-start justify-center">
      <div
        className="h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
        style={{
          width: PREVIEW_WIDTHS[previewMode],
          maxWidth: '100%',
          transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
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