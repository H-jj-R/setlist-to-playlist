import React, { useState, ChangeEvent, KeyboardEvent, FocusEvent } from "react";

interface OTPInputProps {
    setCodeInput: (code: string) => void;
}

/**
 *
 */
const OTPInput: React.FC<OTPInputProps> = ({ setCodeInput }) => {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setCodeInput(newOtp.join(""));

        // Move focus to next input if current one is filled
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`)?.focus();
        }
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>, index: number): void => {
        // TODO: Prevent focus if the previous input is empty
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
        // Move focus to previous input if current is empty
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`)?.focus();
        }
    };

    return (
        <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onFocus={(e) => handleFocus(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="one-time-code"
                />
            ))}
        </div>
    );
};

export default OTPInput;
