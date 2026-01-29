import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  multiline?: boolean;
  page?: string;
}

export function EditableText({
  contentKey,
  defaultValue,
  className = '',
  as: Component = 'span',
  multiline = false,
  page,
}: EditableTextProps) {
  const { isEditMode, trackChange } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [originalValue, setOriginalValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(defaultValue);
    setOriginalValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function handleStartEdit() {
    if (!isEditMode) return;
    setIsEditing(true);
  }

  function handleSave() {
    setIsEditing(false);
    if (value !== originalValue) {
      setOriginalValue(value);
      trackChange(contentKey, value, page);
    }
  }

  function handleCancel() {
    setValue(originalValue);
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  }

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    return (
      <span className="inline-flex items-center gap-2">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn(
              'border-2 border-indigo-500 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-[200px]',
              className
            )}
            rows={3}
            data-testid={`edit-${contentKey}`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn(
              'border-2 border-indigo-500 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300',
              className
            )}
            style={{ width: `${Math.max(value.length * 10, 100)}px` }}
            data-testid={`edit-${contentKey}`}
          />
        )}
        <button
          onClick={handleSave}
          className="p-1 bg-green-500 text-white rounded hover:bg-green-600 shrink-0"
          data-testid={`save-${contentKey}`}
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 bg-slate-400 text-white rounded hover:bg-slate-500 shrink-0"
          data-testid={`cancel-${contentKey}`}
        >
          <X className="w-4 h-4" />
        </button>
      </span>
    );
  }

  return (
    <Component
      className={cn(
        className,
        'cursor-pointer hover:bg-indigo-50 hover:outline hover:outline-2 hover:outline-indigo-300 hover:outline-dashed rounded transition-all relative group'
      )}
      onClick={handleStartEdit}
      data-testid={`editable-${contentKey}`}
    >
      {value}
      <Pencil className="w-3 h-3 text-indigo-400 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Component>
  );
}
