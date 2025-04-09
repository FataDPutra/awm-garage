// components/CustomInput.jsx
const CustomInput = ({
    id,
    label,
    type = "text",
    value,
    onChange,
    error,
    autoComplete,
    isFocused = false,
}) => {
    return (
        <div className="space-y-1">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                autoFocus={isFocused}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default CustomInput;
