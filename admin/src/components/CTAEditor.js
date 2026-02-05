import React from 'react';
import { Plus, Trash2, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * CTAEditor - Edit a list of Call-to-Action buttons
 *
 * @param {Array} ctas - Array of CTA objects [{text, href, primary, external}]
 * @param {Function} onChange - Callback when CTAs change
 */
export default function CTAEditor({ ctas = [], onChange, className = '' }) {
  const handleAdd = () => {
    onChange([...ctas, { text: '', href: '', primary: false, external: false }]);
  };

  const handleRemove = (index) => {
    onChange(ctas.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newCtas = [...ctas];
    newCtas[index] = { ...newCtas[index], [field]: value };
    onChange(newCtas);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newCtas = [...ctas];
    [newCtas[index - 1], newCtas[index]] = [newCtas[index], newCtas[index - 1]];
    onChange(newCtas);
  };

  const handleMoveDown = (index) => {
    if (index === ctas.length - 1) return;
    const newCtas = [...ctas];
    [newCtas[index], newCtas[index + 1]] = [newCtas[index + 1], newCtas[index]];
    onChange(newCtas);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {ctas.map((cta, index) => (
        <div
          key={index}
          className="p-3 border border-gray-200 rounded-lg bg-gray-50 group"
        >
          <div className="flex items-start gap-2">
            {/* Reorder buttons */}
            <div className="flex flex-col gap-0.5 pt-1">
              <button
                type="button"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveDown(index)}
                disabled={index === ctas.length - 1}
                className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Form fields */}
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Button Text</label>
                <input
                  type="text"
                  value={cta.text || ''}
                  onChange={(e) => handleChange(index, 'text', e.target.value)}
                  placeholder="e.g., View Projects"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">URL / Anchor</label>
                <input
                  type="text"
                  value={cta.href || ''}
                  onChange={(e) => handleChange(index, 'href', e.target.value)}
                  placeholder="e.g., #projects or https://..."
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Delete button */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Checkbox options */}
          <div className="flex gap-4 mt-2 ml-7">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cta.primary || false}
                onChange={(e) => handleChange(index, 'primary', e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="text-gray-600">Primary</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cta.external || false}
                onChange={(e) => handleChange(index, 'external', e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="text-gray-600 flex items-center gap-1">
                External <ExternalLink className="w-3 h-3" />
              </span>
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add CTA Button
      </button>
    </div>
  );
}
