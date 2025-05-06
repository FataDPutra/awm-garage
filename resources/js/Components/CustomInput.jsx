const CustomInput = ({
    id,
    label,
    value,
    onChange,
    error,
    type = "text",
    autoComplete,
    isFocused,
    inputClassName = "",
    wrapperClassName = "",
    children, // Prop untuk menambahkan elemen seperti tombol ikon mata
}) => {
    return (
        <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
            <label
                htmlFor={id}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    autoFocus={isFocused}
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                        error
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 ${inputClassName}`}
                />
                {children} {/* Tombol ikon mata akan ditempatkan di sini */}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default CustomInput;
