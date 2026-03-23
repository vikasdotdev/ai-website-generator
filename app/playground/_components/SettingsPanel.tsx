import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  X,
  ChevronDown,
  ChevronRight,
  Type,
  Palette,
  Box,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
} from 'lucide-react';

export type ElementData = {
  selector: string;
  tagName: string;
  className: string;
  innerText: string;
  src?: string;
  href?: string;
  alt?: string;
  // Style properties
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: string;
  textAlign?: string;
};

type SettingsPanelProps = {
  selectedElement: ElementData | null;
  onUpdate: (selector: string, updates: Partial<ElementData>) => void;
  onClose: () => void;
};

// --- Collapsible Section ---
const Section = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-50/80 hover:bg-gray-100/80 transition-colors text-left"
      >
        <Icon className="h-3.5 w-3.5 text-blue-600" />
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex-1">
          {title}
        </span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        )}
      </button>
      {open && <div className="p-3 space-y-3 bg-white">{children}</div>}
    </div>
  );
};

// --- Color Picker Row ---
const ColorPicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="flex items-center gap-2">
    <Label className="text-xs text-gray-500 w-20 shrink-0">{label}</Label>
    <div className="flex items-center gap-1.5 flex-1">
      <div className="relative h-8 w-8 shrink-0 rounded-md border border-gray-200 overflow-hidden shadow-sm">
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
        />
        <div
          className="w-full h-full"
          style={{ backgroundColor: value || '#ffffff' }}
        />
      </div>
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="h-8 text-xs font-mono"
      />
    </div>
  </div>
);

// --- Small Number Input ---
const NumberInput = ({
  label,
  value,
  onChange,
  unit = 'px',
  min = 0,
  max = 200,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  unit?: string;
  min?: number;
  max?: number;
}) => {
  const numericValue = parseInt(value) || 0;
  return (
    <div className="flex flex-col items-center gap-1">
      <Label className="text-[10px] text-gray-400 uppercase">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          min={min}
          max={max}
          value={numericValue}
          onChange={(e) => onChange(e.target.value + unit)}
          className="h-8 w-16 text-xs text-center pr-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
};

// --- Shadow presets ---
const SHADOW_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'SM', value: '0 1px 2px 0 rgba(0,0,0,0.05)' },
  { label: 'MD', value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' },
  { label: 'LG', value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' },
  { label: 'XL', value: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' },
];

const FONT_WEIGHTS = [
  { label: 'Thin', value: '100' },
  { label: 'Light', value: '300' },
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Black', value: '900' },
];

// Helper to parse px values
const parsePx = (val?: string): number => parseInt(val || '0') || 0;

// Helper to convert rgb to hex
const rgbToHex = (rgb: string): string => {
  if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#ffffff';
  if (rgb.startsWith('#')) return rgb;
  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '#ffffff';
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
};

const SettingsPanel = ({ selectedElement, onUpdate, onClose }: SettingsPanelProps) => {
  const [formData, setFormData] = useState<Partial<ElementData>>({});

  useEffect(() => {
    if (selectedElement) {
      setFormData({
        innerText: selectedElement.innerText || '',
        src: selectedElement.src || '',
        href: selectedElement.href || '',
        alt: selectedElement.alt || '',
        backgroundColor: rgbToHex(selectedElement.backgroundColor || ''),
        color: rgbToHex(selectedElement.color || ''),
        fontSize: selectedElement.fontSize || '16px',
        fontWeight: selectedElement.fontWeight || '400',
        paddingTop: selectedElement.paddingTop || '0px',
        paddingRight: selectedElement.paddingRight || '0px',
        paddingBottom: selectedElement.paddingBottom || '0px',
        paddingLeft: selectedElement.paddingLeft || '0px',
        marginTop: selectedElement.marginTop || '0px',
        marginRight: selectedElement.marginRight || '0px',
        marginBottom: selectedElement.marginBottom || '0px',
        marginLeft: selectedElement.marginLeft || '0px',
        borderRadius: selectedElement.borderRadius || '0px',
        boxShadow: selectedElement.boxShadow || 'none',
        opacity: selectedElement.opacity || '1',
        textAlign: selectedElement.textAlign || 'left',
      });
    }
  }, [selectedElement]);

  if (!selectedElement) return null;

  const handleUpdate = (field: keyof ElementData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    onUpdate(selectedElement.selector, { [field]: value });
  };

  const tagName = selectedElement.tagName.toLowerCase();
  const isTextElement = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'button', 'a', 'div', 'label', 'li', 'td', 'th'].includes(tagName);
  const isImageEl = tagName === 'img';
  const isLinkEl = tagName === 'a';

  return (
    <div className="w-[320px] h-[91vh] flex flex-col border-l border-gray-200 bg-white shadow-xl select-none">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Element Settings</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 uppercase">
              {tagName}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* ─── Content Section ─── */}
        {(isTextElement || isImageEl || isLinkEl) && (
          <Section title="Content" icon={Type} defaultOpen={true}>
            {isTextElement && (
              <div className="space-y-1.5">
                <Label htmlFor="innerText" className="text-xs text-gray-500">
                  Text Content
                </Label>
                <Input
                  id="innerText"
                  value={formData.innerText || ''}
                  onChange={(e) => handleUpdate('innerText', e.target.value)}
                  placeholder="Enter text..."
                  className="h-8 text-sm"
                />
              </div>
            )}
            {isLinkEl && (
              <div className="space-y-1.5">
                <Label htmlFor="href" className="text-xs text-gray-500">
                  Link URL
                </Label>
                <Input
                  id="href"
                  value={formData.href || ''}
                  onChange={(e) => handleUpdate('href', e.target.value)}
                  placeholder="https://..."
                  className="h-8 text-sm"
                />
              </div>
            )}
            {isImageEl && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="src" className="text-xs text-gray-500">
                    Image Source
                  </Label>
                  <Input
                    id="src"
                    value={formData.src || ''}
                    onChange={(e) => handleUpdate('src', e.target.value)}
                    placeholder="https://..."
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="alt" className="text-xs text-gray-500">
                    Alt Text
                  </Label>
                  <Input
                    id="alt"
                    value={formData.alt || ''}
                    onChange={(e) => handleUpdate('alt', e.target.value)}
                    placeholder="Image description..."
                    className="h-8 text-sm"
                  />
                </div>
              </>
            )}
          </Section>
        )}

        {/* ─── Colors Section ─── */}
        <Section title="Colors" icon={Palette} defaultOpen={true}>
          <ColorPicker
            label="Background"
            value={formData.backgroundColor || '#ffffff'}
            onChange={(val) => handleUpdate('backgroundColor', val)}
          />
          <ColorPicker
            label="Text"
            value={formData.color || '#000000'}
            onChange={(val) => handleUpdate('color', val)}
          />
        </Section>

        {/* ─── Typography Section ─── */}
        <Section title="Typography" icon={Type} defaultOpen={false}>
          {/* Font Size */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-500">Font Size</Label>
              <span className="text-xs font-mono text-blue-600">
                {parsePx(formData.fontSize)}px
              </span>
            </div>
            <Slider
              min={8}
              max={72}
              step={1}
              value={[parsePx(formData.fontSize)]}
              onValueChange={([val]) => handleUpdate('fontSize', val + 'px')}
              className="py-1"
            />
          </div>

          {/* Font Weight */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Font Weight</Label>
            <div className="grid grid-cols-4 gap-1">
              {FONT_WEIGHTS.map((fw) => (
                <button
                  key={fw.value}
                  onClick={() => handleUpdate('fontWeight', fw.value)}
                  className={`px-1 py-1.5 text-[10px] rounded-md border transition-all ${
                    formData.fontWeight === fw.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {fw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Align */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Text Align</Label>
            <div className="flex gap-1">
              {[
                { value: 'left', icon: AlignLeft },
                { value: 'center', icon: AlignCenter },
                { value: 'right', icon: AlignRight },
                { value: 'justify', icon: AlignJustify },
              ].map(({ value, icon: AlignIcon }) => (
                <button
                  key={value}
                  onClick={() => handleUpdate('textAlign', value)}
                  className={`flex-1 flex items-center justify-center p-1.5 rounded-md border transition-all ${
                    formData.textAlign === value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <AlignIcon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── Spacing Section ─── */}
        <Section title="Spacing" icon={Box} defaultOpen={false}>
          {/* Padding */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Padding</Label>
            <div className="flex items-center justify-center gap-2">
              <NumberInput
                label="Top"
                value={formData.paddingTop || '0px'}
                onChange={(val) => handleUpdate('paddingTop', val)}
              />
              <NumberInput
                label="Right"
                value={formData.paddingRight || '0px'}
                onChange={(val) => handleUpdate('paddingRight', val)}
              />
              <NumberInput
                label="Bottom"
                value={formData.paddingBottom || '0px'}
                onChange={(val) => handleUpdate('paddingBottom', val)}
              />
              <NumberInput
                label="Left"
                value={formData.paddingLeft || '0px'}
                onChange={(val) => handleUpdate('paddingLeft', val)}
              />
            </div>
          </div>

          {/* Margin */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Margin</Label>
            <div className="flex items-center justify-center gap-2">
              <NumberInput
                label="Top"
                value={formData.marginTop || '0px'}
                onChange={(val) => handleUpdate('marginTop', val)}
              />
              <NumberInput
                label="Right"
                value={formData.marginRight || '0px'}
                onChange={(val) => handleUpdate('marginRight', val)}
              />
              <NumberInput
                label="Bottom"
                value={formData.marginBottom || '0px'}
                onChange={(val) => handleUpdate('marginBottom', val)}
              />
              <NumberInput
                label="Left"
                value={formData.marginLeft || '0px'}
                onChange={(val) => handleUpdate('marginLeft', val)}
              />
            </div>
          </div>
        </Section>

        {/* ─── Effects Section ─── */}
        <Section title="Effects" icon={Sparkles} defaultOpen={false}>
          {/* Border Radius */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-500">Border Radius</Label>
              <span className="text-xs font-mono text-blue-600">
                {parsePx(formData.borderRadius)}px
              </span>
            </div>
            <Slider
              min={0}
              max={50}
              step={1}
              value={[parsePx(formData.borderRadius)]}
              onValueChange={([val]) => handleUpdate('borderRadius', val + 'px')}
              className="py-1"
            />
          </div>

          {/* Box Shadow */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Box Shadow</Label>
            <div className="grid grid-cols-5 gap-1">
              {SHADOW_PRESETS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleUpdate('boxShadow', s.value)}
                  className={`px-1.5 py-1.5 text-[10px] rounded-md border transition-all ${
                    formData.boxShadow === s.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-500">Opacity</Label>
              <span className="text-xs font-mono text-blue-600">
                {Math.round(parseFloat(formData.opacity || '1') * 100)}%
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[Math.round(parseFloat(formData.opacity || '1') * 100)]}
              onValueChange={([val]) =>
                handleUpdate('opacity', (val / 100).toFixed(2))
              }
              className="py-1"
            />
          </div>
        </Section>
      </div>
    </div>
  );
};

export default SettingsPanel;
