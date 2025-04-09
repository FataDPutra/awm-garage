import React from "react";
import { Send } from "lucide-react";

const EditSubmitButton = ({ processing, isCalculatingShipping }) => (
    <button
        type="submit"
        disabled={processing || isCalculatingShipping}
        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
        {processing ? (
            "Memproses..."
        ) : (
            <>
                <Send size={20} className="mr-2" /> Update Permintaan
            </>
        )}
    </button>
);

export default EditSubmitButton;
