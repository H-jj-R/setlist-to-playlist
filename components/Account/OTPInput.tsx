/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React, { useState, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";
import { useTranslation } from "react-i18next";

interface OTPInputProps {
    setOtpInput: (otp: string) => void;
}

/**
 *
 */
const OTPInput: React.FC<OTPInputProps> = ({ setOtpInput }) => {
    const { t: i18n } = useTranslation();
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number): void => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[idx] = value;
        setOtp(newOtp);
        setOtpInput(newOtp.join(""));

        // Move focus to next input if current one is filled
        if (value && idx < otp.length - 1) {
            document.getElementById(`otp-input-${idx + 1}`)?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>, idx: number): void => {
        e.preventDefault();
        if (idx !== 0) {
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

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number): void => {
        // Move focus to previous input if current is empty
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            document.getElementById(`otp-input-${idx - 1}`)?.focus();
        } else if (e.key === "ArrowLeft" && idx > 0) {
            e.preventDefault();
            document.getElementById(`otp-input-${idx - 1}`)?.focus();
        } else if (e.key === "ArrowRight" && idx < otp.length - 1) {
            e.preventDefault();
            document.getElementById(`otp-input-${idx + 1}`)?.focus();
        }
    };

    return (
        <fieldset id="otp-fieldset">
            <legend className="sr-only">{i18n("account:enterOTPCode")}</legend>
            <div id="otp-inputs-container" className="flex justify-center space-x-2">
                {otp.map((digit, idx) => (
                    <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="tel"
                        value={digit}
                        onChange={(e) => handleChange(e, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        onPaste={(e) => handlePaste(e, idx)}
                        maxLength={1}
                        required
                        className="w-12 h-12 text-center text-xl border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoComplete="one-time-code"
                        aria-label={i18n("account:digitOfOTP", { digit: idx + 1 })}
                        aria-required="true"
                    />
                ))}
            </div>
        </fieldset>
    );
};

export default OTPInput;
