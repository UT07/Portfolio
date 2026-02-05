import React from 'react';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * DynamicList - Add/remove/reorder items in a list
 *
 * @param {Array} items - The list items
 * @param {Function} onChange - Callback when items change
 * @param {Function} renderItem - Render function for each item (item, index, onChange) => JSX
 * @param {Function} createItem - Factory function to create a new item () => newItem
 * @param {string} addLabel - Label for the add button
 * @param {boolean} orderable - Whether items can be reordered
 * @param {number} minItems - Minimum number of items
 * @param {number} maxItems - Maximum number of items
 */
export default function DynamicList({
  items = [],
  onChange,
  renderItem,
  createItem = () => '',
  addLabel = 'Add Item',
  orderable = true,
  minItems = 0,
  maxItems = Infinity,
  className = '',
}) {
  const handleAdd = () => {
    if (items.length >= maxItems) return;
    onChange([...items, createItem()]);
  };

  const handleRemove = (index) => {
    if (items.length <= minItems) return;
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleChange = (index, newValue) => {
    const newItems = [...items];
    newItems[index] = newValue;
    onChange(newItems);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    onChange(newItems);
  };

  const handleMoveDown = (index) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    onChange(newItems);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2 group">
          {orderable && (
            <div className="flex flex-col gap-0.5 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                disabled={index === items.length - 1}
                className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex-1">
            {renderItem(item, index, (newValue) => handleChange(index, newValue))}
          </div>

          {items.length > minItems && (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      {items.length < maxItems && (
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      )}
    </div>
  );
}

/**
 * SimpleListItem - A basic text input for simple string lists
 */
export function SimpleListItem({ value, onChange, placeholder = 'Enter text...' }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

/**
 * TextareaListItem - A textarea for longer text items
 */
export function TextareaListItem({ value, onChange, placeholder = 'Enter text...', rows = 2 }) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
