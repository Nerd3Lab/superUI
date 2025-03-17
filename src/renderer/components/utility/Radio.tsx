interface RadioProps {
  name: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}

export default function Radio({
  name,
  label,
  description,
  checked,
  onChange,
}: RadioProps) {
  return (
    <label className="flex items-start space-x-3 cursor-pointer">
      {/* Custom Radio Button */}
      <div className="relative w-5 h-5">
        <input
          type="radio"
          name={name} // Group radios together
          checked={checked}
          onChange={onChange} // Calls parent function
          className="hidden"
        />
        <div
          className={`w-5 h-5 border-2 border-red-600 rounded-full flex items-center justify-center ${
            checked ? 'bg-red-600' : 'bg-white'
          }`}
        >
          {checked && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
        </div>
      </div>

      {/* Label and Description */}
      <div>
        <span className="font-medium text-gray-900">{label}</span>
        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
    </label>
  );
}
