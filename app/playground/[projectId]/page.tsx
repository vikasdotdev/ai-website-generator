"use client"
import React, { useEffect, useState } from 'react'
import PlaygroundHeader from '../_components/PlaygroundHeader'
import ChatSection from '../_components/ChatSection'
import WebsiteDesign from '../_components/WebsiteDesign'
import { useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'

export type Messages = {
  role: string
  content: string
}

const Prompt = `userInput: {userInput}
Instructions:
1. If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output (e.g., "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then:
   - Generate a complete HTML Tailwind CSS code using Flowbite UI components.  
   - Use a modern design with **blue as the primary color theme**.  
   - Only include the <body> content (do not add <head> or <title>).  
   - Make it fully responsive for all screen sizes.  
   - All primary components must match the theme color.  
   - Add proper padding and margin for each element.  
   - Components should be independent; do not connect them.  
   - Use placeholders for all images:  
       - Light mode: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
       - Dark mode: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
       - Add alt tag describing the image prompt.  
   - Use the following libraries/components where appropriate:  
       - FontAwesome icons (fa fa-)  
       - Flowbite UI components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, accordions, etc.  
       - Chart.js for charts & graphs  
       - Swiper.js for sliders/carousels  
       - Tippy.js for tooltips & popovers  
   - Include interactive components like modals, dropdowns, and accordions.  
   - Ensure proper spacing, alignment, hierarchy, and theme consistency.  
   - Ensure charts are visually appealing and match the theme color.  
   - Header menu options should be spread out and not connected.  
   - Do not include broken links.  
   - Do not add any extra text before or after the HTML code.  

2. If the user input is **general text or greetings** (e.g., "Hi", "Hello", "How are you?") **or does not explicitly ask to generate code**, then:
   - Respond with a simple, friendly text message instead of generating any code.  
`

export type Frame = {
  projectId: string
  frameId: string
  designCode: string
  chatMessages: Messages[]
}

const PlayGround = () => {
  const { projectId } = useParams()
  const params = useSearchParams()
  const frameId = params.get('frameId')

  const [frameDetail, setFrameDetail] = useState<Frame | null>(null)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Messages[]>([])
  const [generatedCode, setGeneratedCode] = useState<string>("")

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
      }
    } catch (err) {
      console.error("Error fetching frame details", err);
    }
  }

  const SendMessage = async (userInput: string) => {
    setLoading(true)

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

        // 3. Check for Code vs Text
        if (aiResponse.includes('```html')) {
          isCode = true;
          const codeStart = aiResponse.indexOf("```html") + 7;
          const currentCode = aiResponse.slice(codeStart).replace('```', '');
          setGeneratedCode(currentCode);
          
          // Update chat bubble to show status
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].content = "Generating HTML Design...";
            return updated;
          });
        } else {
          // If it's plain text (Hi/Hello), update the chat bubble in real-time
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].content = aiResponse;
            return updated;
          });
        }
      }

      // 4. Final Save to Database once streaming is finished
      await axios.put('/api/users', { // Note: Verify if your PUT route is /api/users or /api/chat-history
        messages: [...messages, userMessage, { role: 'assistant', content: isCode ? "Design Completed!" : aiResponse }],
        frameId: frameId
      });

    } catch (error) {
      console.error("SendMessage Error:", error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <PlaygroundHeader />
      <div className="flex flex-1 overflow-hidden">
        <ChatSection
          messages={messages}
          onSend={SendMessage}
          loading={loading}
        />
        <WebsiteDesign generatedCode={generatedCode} />
      </div>
    </div>
  )
}

export default PlayGround