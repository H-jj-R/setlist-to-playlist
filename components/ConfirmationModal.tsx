import React from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onConfirm, onCancel }) => {
    const { t: i18n } = useTranslation();
    const { resolvedTheme } = useTheme();
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
                className={`w-3/4 max-w-sm rounded-lg shadow-lg p-6 ${
                    resolvedTheme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                }`}
            >
                <h2 className="text-xl font-bold mb-4">{i18n("common:areYouSure")}</h2>
                <p className="mb-6">{i18n("account:permanentAction")}</p>
                <div className="flex justify-between">
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300"
                    >
                        {i18n("account:yesDelete")}
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors duration-300"
                    >
                        {i18n("common:cancel")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
