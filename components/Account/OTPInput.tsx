/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Props for the `OTPInput` component.
 *
 * @property {Function} setOtpInput - Function to update the OTP value in the parent component.
 */
interface OTPInputProps {
    setOtpInput: (otp: string) => void;
}

/**
 * **OTPInput Component**
 *
 * Allows user to enter a 6-digit verification code.
 *
 * @param OTPInputProps - Component props.
 *
 * @returns {JSX.Element} The rendered `OTPInput` component.
 */
const OTPInput: React.FC<OTPInputProps> = ({ setOtpInput }): JSX.Element => {
    const { t: i18n } = useTranslation(); // Translation hook
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]); // Tracks state of each input

    /**
     * Handles input change for OTP fields.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     * @param {number} idx - Index of the OTP input being changed.
     */
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, idx: number): void => {
            const value = e.target.value;
            if (/[^0-9]/.test(value)) return; // Only allow numeric input

            const newOtp = [...otp];
            newOtp[idx] = value;
            setOtp(newOtp);
            setOtpInput(newOtp.join(""));

            // Move focus to next input if current one is filled
            if (value && idx < otp.length - 1) {
                document.getElementById(`otp-input-${idx + 1}`)?.focus();
            }
        },
        [otp, setOtpInput]
    );

    /**
     * Handles pasting a full OTP into the inputs.
     *
     * @param {React.ClipboardEvent<HTMLInputElement>} e - The paste event.
     * @param {number} idx - Index of the OTP input where paste occurred.
     */
    const handlePaste = useCallback(
        (e: React.ClipboardEvent<HTMLInputElement>, idx: number): void => {
            e.preventDefault();
            if (idx !== 0) return; // Only allow paste in the first input

            const pastedData = e.clipboardData.getData("text").trim();
            if (!/^\d{6}$/.test(pastedData)) return; // Ensure exactly 6 digits

            const newOtp = pastedData.split("");
            setOtp(newOtp);
            setOtpInput(newOtp.join(""));

            // Move focus to the last filled input
            document.getElementById(`otp-input-${newOtp.length - 1}`)?.focus();
        },
        [setOtpInput]
    );

    /**
     * Handles keydown events for navigation between inputs.
     *
     * @param {React.KeyboardEvent<HTMLInputElement>} e - The keydown event.
     * @param {number} idx - Index of the OTP input where keydown occurred.
     */
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>, idx: number): void => {
            if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                document.getElementById(`otp-input-${idx - 1}`)?.focus(); // Move focus to previous input
            } else if (e.key === "ArrowLeft" && idx > 0) {
                e.preventDefault();
                document.getElementById(`otp-input-${idx - 1}`)?.focus(); // Navigate left
            } else if (e.key === "ArrowRight" && idx < otp.length - 1) {
                e.preventDefault();
                document.getElementById(`otp-input-${idx + 1}`)?.focus(); // Navigate right
            }
        },
        [otp]
    );

    return (
        <fieldset id="otp-fieldset">
            <legend id="otp-legend" className="sr-only">
                {i18n("account:enterOTPCode")}
            </legend>
            <div id="otp-inputs-container" className="flex justify-center space-x-2">
                {otp.map((digit: string, idx: number) => (
                    <input
                        id={`otp-input-${idx}`}
                        className="h-12 w-12 rounded-md border border-gray-500 text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={i18n("account:digitOfOTP", { digit: idx + 1 })}
                        aria-required="true"
                        autoComplete="one-time-code"
                        key={idx}
                        maxLength={1}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleChange(e, idx)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => handleKeyDown(e, idx)}
                        onPaste={(e: React.ClipboardEvent<HTMLInputElement>): void => handlePaste(e, idx)}
                        required
                        type="tel"
                        value={digit}
                    />
                ))}
            </div>
        </fieldset>
    );
};

export default OTPInput;
