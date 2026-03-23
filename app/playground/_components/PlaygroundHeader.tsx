import { Button } from '@/components/ui/button'
import { Loader2Icon, Download, Copy, Monitor, Tablet, Smartphone, Code2, Eye } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'
import { PreviewMode } from '../[projectId]/page'

export type ActiveTab = 'preview' | 'code'

type Props = {
  isSaving?: boolean
  onSave?: () => void
  generatedCode?: string
  previewMode: PreviewMode
  onPreviewModeChange: (mode: PreviewMode) => void
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
}

const PREVIEW_MODES: { mode: PreviewMode; icon: React.ElementType; label: string }[] = [
  { mode: 'desktop', icon: Monitor, label: 'Desktop' },
  { mode: 'tablet', icon: Tablet, label: 'Tablet' },
  { mode: 'mobile', icon: Smartphone, label: 'Mobile' },
];

const PlaygroundHeader = ({ isSaving, onSave, generatedCode = "", previewMode, onPreviewModeChange, activeTab, onTabChange }: Props) => {

  const getCleanHTML = () => {
    // 1. Strip internal builder classes
    let cleanHTML = generatedCode
      .replace(/ai-selected-element/g, "")
      .replace(/ai-hovered-element/g, "");

    // 2. Wrap in production HTML layout matching the iframe
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Website</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Flowbite CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
    
    <style>
       html { scroll-behavior: smooth; }
    </style>
</head>
<body class="bg-white min-h-screen">

  ${cleanHTML}

  <!-- Flowbite JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
</body>
</html>`;
  };

  const handleCopy = async () => {
    if (!generatedCode) {
      toast.error('No code generated yet.');
      return;
    }
    const htmlString = getCleanHTML();
    try {
      await navigator.clipboard.writeText(htmlString);
      toast.success('Code copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy code.');
    }
  };

  const handleDownload = () => {
    if (!generatedCode) {
      toast.error('No code generated yet.');
      return;
    }
    const htmlString = getCleanHTML();
    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website_export.html';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Download started!');
  };

  return (
    <div className='flex justify-between items-center p-4 shadow'>
        <Image src={'/logo.svg'} alt='logo' width={40} height={40}/>

        {/* Center Controls: Preview/Code Toggle + Responsive Modes */}
        <div className="flex items-center gap-3">
          {/* Preview / Code Tab Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
            <button
              onClick={() => onTabChange('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                activeTab === 'preview'
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => onTabChange('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                activeTab === 'code'
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>Code</span>
            </button>
          </div>

          {/* Responsive Preview Toggle — only shown in Preview mode */}
          {activeTab === 'preview' && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
              {PREVIEW_MODES.map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => onPreviewModeChange(mode)}
                  title={label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    previewMode === mode
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} disabled={!generatedCode}>
                <Copy className='mr-2 h-4 w-4' />
                Copy
            </Button>
            <Button variant="outline" onClick={handleDownload} disabled={!generatedCode}>
                <Download className='mr-2 h-4 w-4' />
                Download
            </Button>
            <Button onClick={onSave} disabled={isSaving}>
                {isSaving && <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />}
                Save
            </Button>
        </div>
    </div>
  )
}

export default PlaygroundHeader