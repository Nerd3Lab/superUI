import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

export interface Option {
  value: string;
  label: string;
  imgSrc?: string;
}

interface SelectProps {
  options: Option[];
  defaultValue?: Option;
  onSelect?: (option: Option) => void;
  label?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: Option;
}

export default function Select({
  options,
  defaultValue,
  onSelect,
  value,
  label,
  required = false,
  className = '',
  placeholder = 'Please select an option',
  disabled = false,
}: SelectProps) {
  const [selected, setSelected] = useState<Option | undefined>(
    defaultValue || undefined,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: Option) => {
    // setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = () => {
    if (options.length === 0 || disabled) {
      return;
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-gray-700 font-medium mb-1 text-sm">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        onClick={handleClick}
        className="w-full flex items-center justify-between border border-gray-300 py-2 px-4 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selected ? (
          <div className="flex items-center space-x-2">
            {selected.imgSrc && (
              <img
                src={selected.imgSrc}
                alt={selected.label}
                className="w-5 h-5"
              />
            )}
            <span>{selected.label}</span>
          </div>
        ) : (
          <span>{placeholder}</span>
        )}
        <Icon icon="akar-icons:chevron-down" className="text-gray-500" />
      </button>

      {isOpen && (
        <ul className="absolute left-0 w-full border border-gray-300 bg-white rounded-lg shadow-md mt-1 z-10 max-h-48 overflow-y-auto">
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`flex items-center px-4 py-2 cursor-pointer ${
                index === highlightedIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => handleSelect(option)}
            >
              {option.imgSrc && (
                <img
                  src={option.imgSrc}
                  alt={option.label}
                  className="w-5 h-5 mr-2"
                />
              )}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
