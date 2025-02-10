/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { Body, Container, Head, Heading, Html, Text } from "@react-email/components";

interface ForgotPasswordEmailTemplateProps {
    otp: string;
}

/**
 *
 */
const ForgotPasswordEmailTemplate: React.FC<ForgotPasswordEmailTemplateProps> = ({ otp }): JSX.Element => {
    return (
        <Html>
            <Head />
            <Body style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif", padding: "20px" }}>
                <Container
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        margin: "0 auto",
                        maxWidth: "600px",
                        padding: "20px"
                    }}
                >
                    <Heading style={{ color: "#333", fontSize: "20px" }}>Reset Your Password</Heading>
                    <Text style={{ color: "#555" }}>
                        You requested a password reset. Use the following code to reset your password:
                    </Text>
                    <div
                        aria-live="assertive"
                        role="alert"
                        style={{
                            backgroundColor: "#2563eb",
                            borderRadius: "5px",
                            color: "#ffffff",
                            fontSize: "24px",
                            fontWeight: "bold",
                            padding: "10px",
                            textAlign: "center"
                        }}
                    >
                        {otp}
                    </div>
                    <Text style={{ color: "#555" }}>If you didn't request this, you can safely ignore this email.</Text>
                    <Text style={{ color: "#888", fontSize: "12px" }}>This code will expire in 10 minutes.</Text>
                </Container>
            </Body>
        </Html>
    );
};

export default ForgotPasswordEmailTemplate;
