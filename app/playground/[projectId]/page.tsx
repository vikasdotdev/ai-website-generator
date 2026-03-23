"use client"
import React, { useEffect, useState } from 'react'
import PlaygroundHeader from '../_components/PlaygroundHeader'
import { ActiveTab } from '../_components/PlaygroundHeader'
import ChatSection from '../_components/ChatSection'
import WebsiteDesign from '../_components/WebsiteDesign'
import CodeEditorPanel from '../_components/CodeEditorPanel'
import SettingsPanel, { ElementData } from '../_components/SettingsPanel'
import { useParams, useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import { UserDetailContext } from '@/context/UserDetailContext'
import axios from 'axios'
import { toast } from 'sonner'

export type Messages = {
  role: string
  content: string
}

const Prompt = `You are an expert frontend developer. You MUST generate a complete, production-ready, fully populated website based on the user's request.

USER REQUEST: {userInput}

CRITICAL RULES — FOLLOW EVERY ONE:
1. ALWAYS output complete HTML code. NEVER respond with text, questions, or explanations.
2. Wrap your output in \`\`\`html and \`\`\` markers.
3. Only include the <body> content (do NOT include <html>, <head>, or <title> tags).
4. Use Tailwind CSS utility classes for all styling.
5. Use Flowbite UI components (buttons, cards, modals, forms, tables, tabs, alerts, dropdowns, accordions).
6. Use FontAwesome icons (fa fa-*) for every card, stat, menu item, and action — never leave icons out.
7. Use blue as the primary color theme. All components must match the theme.
8. Make the design fully responsive for all screen sizes.
9. Add proper padding, margin, spacing, and visual hierarchy.
10. Use these placeholder images where images are needed:
    - https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
    - Add descriptive alt tags.
11. Include interactive elements: hover effects, modals, dropdowns, accordions.
12. Make the design modern, clean, and professional — like a real SaaS product.
13. Do NOT add any text before or after the code. Output ONLY the HTML code block.
14. If the user's request is vague (like "hi" or "hello"), generate a beautiful modern landing page instead.

CONTENT COMPLETENESS RULES — MANDATORY:
15. EVERY card MUST contain: a FontAwesome icon, a title, a number/value, and a trend indicator (e.g., +12%, ↑ 5%).
16. EVERY table MUST contain at least 5 realistic sample rows with realistic data:
    - Names: John Doe, Sarah Smith, Alex Johnson, Emily Chen, Michael Brown
    - Emails: john@example.com, sarah@company.io, etc.
    - Amounts: $1,250.00, $3,800.50, $950.25
    - Statuses: Active, Pending, Completed, Cancelled
17. EVERY stat/KPI section MUST use realistic dummy numbers:
    - Revenue: $48,250  |  Users: 2,847  |  Orders: 1,432  |  Growth: +18.2%
18. Charts MUST be rendered with real data using Chart.js. Include a <script> tag at the end with Chart.js initialization:
    - Use <canvas id="uniqueChartId"></canvas> for each chart
    - Add a <script> block that creates new Chart() with type, labels, datasets, and options
    - Use sample data arrays like [1200, 1900, 3000, 5000, 4200, 6800, 7400]
    - Use chart types: 'line', 'bar', 'doughnut', or 'pie'
    - Style charts to match the blue theme (use rgba(59, 130, 246, ...) colors)
19. NEVER generate empty divs, blank containers, empty cards, or placeholder rectangles.
20. Every section must have a heading AND descriptive body content — no heading-only sections.
21. Navigation menus must have at least 5 menu items with proper labels.
22. Forms must include labels, placeholder text inside inputs, and a styled submit button.
23. Sidebar navigation must include icons (fa fa-*) next to every menu label.
24. Footer sections must include columns: About, Product, Resources, Company — each with 4+ links.
25. FINAL CHECK: Before outputting, audit your code. If any section is visually empty or has no text content, add content to it. The result must look like a finished, demo-ready product.
`



export type Frame = {
  projectId: string
  frameId: string
  designCode: string
  chatMessages: Messages[]
}

export type PreviewMode = 'desktop' | 'tablet' | 'mobile';

// Extracts HTML code from AI responses — handles both ```html fenced and raw HTML
function extractCode(text: string): string | null {
  // Case 1: Markdown fenced code block
  if (text.includes('```html')) {
    const codeStart = text.indexOf('```html') + 7;
    let code = text.slice(codeStart);
    // Remove closing fence if present
    const closingFence = code.lastIndexOf('```');
    if (closingFence > 0) {
      code = code.slice(0, closingFence);
    }
    return code.trim();
  }

  // Case 2: Raw HTML (no markdown fences) — detect by looking for HTML tags
  const trimmed = text.trim();
  if (
    trimmed.startsWith('<') ||
    trimmed.includes('<div') ||
    trimmed.includes('<section') ||
    trimmed.includes('<nav') ||
    trimmed.includes('<header')
  ) {
    return trimmed;
  }

  return null;
}

const PlayGround = () => {
  const { projectId } = useParams()
  const params = useSearchParams()
  const frameId = params.get('frameId')

  const [frameDetail, setFrameDetail] = useState<Frame | null>(null)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Messages[]>([])
  const [generatedCode, setGeneratedCode] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [selectedElement, setSelectedElement] = useState<any>(null)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop')
  const [activeTab, setActiveTab] = useState<ActiveTab>('preview')
  
  const { UserDetail, setUserDetail, refetchCredits } = useContext(UserDetailContext);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ELEMENT_SELECTED') {
        setSelectedElement(event.data.payload)
        console.log("Element selected:", event.data.payload)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    if (frameId) {
      GetFrameDetails()
    }
  }, [frameId])

  const GetFrameDetails = async () => {
    try {
      const result = await axios.get(
        `/api/frames?frameId=${frameId}&projectId=${projectId}`
      )
      setFrameDetail(result.data)

      if (result.data?.chatMessages?.length === 1) {
        const userMsg = result.data?.chatMessages[0].content;
        SendMessage(userMsg)
      } else {
        setMessages(result.data?.chatMessages || []);
        // Also set the generated code if it exists in DB
        if(result.data?.designCode) {
            setGeneratedCode(result.data.designCode);
        }
      }
    } catch (err) {
      console.error("Error fetching frame details", err);
    }
  }

  const SendMessage = async (userInput: string) => {
    // Prevent execution if out of credits
    if ((UserDetail?.credits ?? 0) <= 0) {
      toast.error('Not enough credits. Please upgrade your plan.');
      return;
    }

    setLoading(true)

    // Optimistically deduct credit from context state
    setUserDetail((prev: any) => ({
      ...prev,
      credits: (prev?.credits ?? 0) - 1
    }));

    // 1. Update UI with User Message
    const userMessage = { role: 'user', content: userInput };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('/api/ai-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: Prompt.replace('{userInput}', userInput) }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData?.error || 'Failed to generate');
        // Sync credits from DB since call failed (server may not have deducted)
        await refetchCredits();
        return;
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';
      let isCode = false;

      // 2. Add placeholder Assistant message to be filled by stream
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;

        // 3. Extract code — handle both ```html fenced and raw HTML responses
        const extracted = extractCode(aiResponse);
        if (extracted) {
          isCode = true;
          setGeneratedCode(extracted);
          
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].content = "Generating HTML Design...";
            return updated;
          });
        } else {
          // Streaming text — show in chat bubble in real-time
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].content = aiResponse;
            return updated;
          });
        }
      }

      // 4. Final code extraction
      let finalDesignCode = undefined;
      const finalExtracted = extractCode(aiResponse);
      if (finalExtracted) {
        isCode = true;
        finalDesignCode = finalExtracted;
        setGeneratedCode(finalExtracted);
        
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = "Design Created! ✅";
          return updated;
        });
      }

      // 5. Save to Database
      await axios.put('/api/frames', { 
        messages: [...messages, userMessage, { role: 'assistant', content: isCode ? "Design Created! ✅" : aiResponse }],
        frameId: frameId,
        designCode: finalDesignCode
      });

      // Sync credits from database after successful generation
      await refetchCredits();

    } catch (error) {
      console.error("SendMessage Error:", error);
    } finally {
      setLoading(false)
    }
  } // <-- Added closing brace for SendMessage

  const handleSave = async () => {
    if (!frameId) return;
    setIsSaving(true);
    try {
      // Grab the latest HTML from the iframe (includes inline styles from visual edits)
      let codeToSave = generatedCode;
      const iframe = document.querySelector('iframe') as HTMLIFrameElement | null;
      if (iframe?.contentDocument) {
        const root = iframe.contentDocument.getElementById('preview-root');
        if (root) {
          // Clean up editor-specific classes before saving
          const cloned = root.cloneNode(true) as HTMLElement;
          cloned.querySelectorAll('.ai-selected-element, .ai-hovered-element').forEach(node => {
            node.classList.remove('ai-selected-element', 'ai-hovered-element');
          });
          codeToSave = cloned.innerHTML;
          // Also update React state so it stays in sync
          setGeneratedCode(codeToSave);
        }
      }

      await axios.put('/api/frames', {
        messages: messages,
        frameId: frameId,
        designCode: codeToSave
      });
      toast.success('Project Saved Successfully!');
    } catch (err) {
      console.error("Save Error:", err);
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  }

  const handleElementUpdate = (selector: string, updates: Partial<ElementData>) => {
    // Send postMessage to the iframe
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'UPDATE_ELEMENT',
        payload: { selector, updates }
      }, '*');
    }
    
    // Also update the local selectedElement state so Inputs remain fresh if needed
    setSelectedElement((prev: any) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  };

  const handleClosePanel = () => {
    setSelectedElement(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <PlaygroundHeader
        isSaving={isSaving}
        onSave={handleSave}
        generatedCode={generatedCode}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex flex-1 overflow-hidden">
        <ChatSection
          messages={messages}
          onSend={SendMessage}
          loading={loading}
        />
        {activeTab === 'preview' ? (
          <WebsiteDesign
            generatedCode={generatedCode}
            setGeneratedCode={setGeneratedCode}
            previewMode={previewMode}
          />
        ) : (
          <CodeEditorPanel
            generatedCode={generatedCode}
            onCodeChange={setGeneratedCode}
          />
        )}
        {activeTab === 'preview' && selectedElement && (
          <SettingsPanel 
            selectedElement={selectedElement} 
            onUpdate={handleElementUpdate} 
            onClose={handleClosePanel} 
          />
        )}
      </div>
    </div>
  )
}

export default PlayGround