"use client"
import React, { useRef, useEffect, useCallback } from 'react'
import { Copy, Download, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Props = {
  generatedCode: string
  onCodeChange: (code: string) => void
}

function getCleanHTML(code: string) {
  const cleanHTML = code
    .replace(/ai-selected-element/g, "")
    .replace(/ai-hovered-element/g, "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Website</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"><\/script>
    
    <!-- Flowbite CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"><\/script>
    
    <style>
       html { scroll-behavior: smooth; }
    </style>
</head>
<body class="bg-white min-h-screen">

  ${cleanHTML}

  <!-- Flowbite JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"><\/script>
</body>
</html>`;
}

const CodeEditorPanel = ({ generatedCode, onCodeChange }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  // Sync scroll between textarea and line numbers
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  // Calculate line numbers
  const lineCount = generatedCode ? generatedCode.split('\n').length : 1
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)

  const handleCopy = async () => {
    if (!generatedCode) {
      toast.error('No code generated yet.')
      return
    }
    const htmlString = getCleanHTML(generatedCode)
    try {
      await navigator.clipboard.writeText(htmlString)
      toast.success('Code copied successfully!')
    } catch (err) {
      toast.error('Failed to copy code.')
    }
  }

  const handleDownload = () => {
    if (!generatedCode) {
      toast.error('No code generated yet.')
      return
    }
    const htmlString = getCleanHTML(generatedCode)
    const blob = new Blob([htmlString], { type: 'text/html' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'website_export.html'
    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Download started!')
  }

  return (
    <div className="flex-1 h-[91vh] flex flex-col overflow-hidden bg-[#1e1e2e]">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-[#313244]">
        <div className="flex items-center gap-2 text-[#cdd6f4]">
          <Code2 className="h-4 w-4 text-[#89b4fa]" />
          <span className="text-xs font-medium tracking-wide">HTML / CSS</span>
          <span className="text-[10px] text-[#6c7086] ml-2">
            {lineCount} lines
          </span>
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!generatedCode}
            className="h-7 px-2.5 text-xs text-[#cdd6f4] hover:bg-[#313244] hover:text-[#89b4fa] transition-colors"
          >
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={!generatedCode}
            className="h-7 px-2.5 text-xs text-[#cdd6f4] hover:bg-[#313244] hover:text-[#a6e3a1] transition-colors"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="select-none overflow-hidden py-4 px-2 text-right bg-[#1e1e2e] border-r border-[#313244] shrink-0"
          style={{ width: '52px' }}
        >
          {lineNumbers.map((num) => (
            <div
              key={num}
              className="text-[11px] leading-[20px] text-[#6c7086] font-mono"
            >
              {num}
            </div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          ref={textareaRef}
          value={generatedCode}
          onChange={(e) => onCodeChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
          className="flex-1 resize-none bg-[#1e1e2e] text-[#cdd6f4] font-mono text-[13px] leading-[20px] p-4 outline-none border-none focus:ring-0 focus:outline-none"
          style={{
            tabSize: 2,
            caretColor: '#89b4fa',
          }}
          placeholder="// Your generated code will appear here...&#10;// Use AI chat to generate a website, then edit the code directly."
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#181825] border-t border-[#313244] text-[10px] text-[#6c7086]">
        <div className="flex gap-3">
          <span>HTML</span>
          <span>UTF-8</span>
        </div>
        <div className="flex gap-3">
          <span>{generatedCode.length} characters</span>
          <span>{lineCount} lines</span>
        </div>
      </div>
    </div>
  )
}

export default CodeEditorPanel
