import React from "react";

interface ForgotPasswordEmailTemplateProps {
    code: string;
}

const ForgotPasswordEmailTemplate: React.FC<ForgotPasswordEmailTemplateProps> = ({ code }) => {
    return (
        <div className="font-sans max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-gray-100">
            <h1 className="text-xl font-bold text-gray-800">Reset Your Password</h1>
            <p className="text-gray-700 mt-2">You requested a password reset. Use the following code to reset your password:</p>
            // TODO: Make code bigger on email
            <div className="text-center my-4 p-3 text-4xl font-mono font-bold text-white bg-blue-600 rounded-lg">
                {code}
            </div>
            <p className="text-gray-700">If you didn't request this, you can safely ignore this email.</p>
            <p className="text-gray-500 mt-4">This code will expire in 10 minutes.</p>
        </div>
    );
};

export default ForgotPasswordEmailTemplate;
