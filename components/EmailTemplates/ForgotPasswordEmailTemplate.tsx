/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { Html, Head, Body, Container, Heading, Text } from "@react-email/components";

interface ForgotPasswordEmailTemplateProps {
    otp: string;
}

/**
 *
 */
const ForgotPasswordEmailTemplate: React.FC<ForgotPasswordEmailTemplateProps> = ({ otp }) => {
    return (
        <Html>
            <Head />
            <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f3f4f6", padding: "20px" }}>
                <Container
                    style={{
                        maxWidth: "600px",
                        margin: "0 auto",
                        backgroundColor: "#ffffff",
                        padding: "20px",
                        borderRadius: "8px",
                        border: "1px solid #ddd"
                    }}
                >
                    <Heading style={{ fontSize: "20px", color: "#333" }}>Reset Your Password</Heading>
                    <Text style={{ color: "#555" }}>
                        You requested a password reset. Use the following code to reset your password:
                    </Text>
                    <div
                        style={{
                            textAlign: "center",
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#ffffff",
                            backgroundColor: "#2563eb",
                            padding: "10px",
                            borderRadius: "5px"
                        }}
                    >
                        {otp}
                    </div>
                    <Text style={{ color: "#555" }}>If you didn't request this, you can safely ignore this email.</Text>
                    <Text style={{ fontSize: "12px", color: "#888" }}>This code will expire in 10 minutes.</Text>
                </Container>
            </Body>
        </Html>
    );
};

export default ForgotPasswordEmailTemplate;
