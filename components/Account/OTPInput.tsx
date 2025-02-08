/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React, { useState, ChangeEvent, KeyboardEvent, FocusEvent, ClipboardEvent } from "react";

interface OTPInputProps {
    setOtpInput: (otp: string) => void;
}

/**
 *
 */
const OTPInput: React.FC<OTPInputProps> = ({ setOtpInput }) => {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOtpInput(newOtp.join(""));

        // Move focus to next input if current one is filled
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`)?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number): void => {
        e.preventDefault();
        if (index !== 0) {
            return;
        }
        const pastedData = e.clipboardData.getData("text").trim();
        if (!/^\d{6}$/.test(pastedData)) {
            return;
        }

        const newOtp = pastedData.split("");
        setOtp(newOtp);
        setOtpInput(newOtp.join(""));

        // Move focus to the last filled input
        document.getElementById(`otp-input-${newOtp.length - 1}`)?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
        // Move focus to previous input if current is empty
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`)?.focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            document.getElementById(`otp-input-${index - 1}`)?.focus();
        } else if (e.key === "ArrowRight" && index < otp.length - 1) {
            e.preventDefault();
            document.getElementById(`otp-input-${index + 1}`)?.focus();
        }
    };

    return (
        <fieldset>
            <legend className="sr-only">Enter the OTP code</legend>
            <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="tel"
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={(e) => handlePaste(e, index)}
                        maxLength={1}
                        required
                        className="w-12 h-12 text-center text-xl border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoComplete="one-time-code"
                        aria-label={`Digit ${index + 1} of OTP`}
                        aria-required="true"
                    />
                ))}
            </div>
        </fieldset>
    );
};

export default OTPInput;
