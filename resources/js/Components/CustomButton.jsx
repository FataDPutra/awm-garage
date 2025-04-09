// components/CustomButton.jsx
const CustomButton = ({ children, disabled, className = "", ...props }) => {
    return (
        <button
            type="submit"
            disabled={disabled}
            className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default CustomButton;
