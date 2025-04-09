const CustomCheckbox = ({ name, checked, onChange, label }) => {
    return (
        <label className="flex items-center space-x-2">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 border-gray-300 dark:border-zinc-700 rounded focus:ring-blue-500 dark:bg-zinc-800"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
                {label}
            </span>
        </label>
    );
};

export default CustomCheckbox;
