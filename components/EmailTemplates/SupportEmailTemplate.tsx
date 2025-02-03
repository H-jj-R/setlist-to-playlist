import React from "react";

interface SupportEmailTemplateProps {
    email: string;
    message: string;
}

/**
 *
 */
const SupportEmailTemplate: React.FC<Readonly<SupportEmailTemplateProps>> = ({ email, message }) => {
    return (
        <div className="font-sans max-w-lg mx-auto p-5 border border-gray-300 rounded-lg bg-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">Support/Feedback</h2>
            <p className="text-md text-gray-700 mt-4">
                <strong>From:</strong> {email}
            </p>
            <div className="bg-white p-5 rounded-lg shadow-md mt-3">
                <p className="text-md text-gray-900 whitespace-pre-wrap">
                    <strong>Message:</strong> {message}
                </p>
            </div>
        </div>
    );
};

export default SupportEmailTemplate;
