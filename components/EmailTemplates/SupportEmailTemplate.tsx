/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { Body, Container, Head, Heading, Html, Section, Text } from "@react-email/components";

/**
 * Props for the `SupportEmailTemplate` component.
 *
 * @property {string} email - The email address of the user sending the support request / feedback.
 * @property {string} message - The support message or feedback submitted by the user.
 */
interface SupportEmailTemplateProps {
    email: string;
    message: string;
}

/**
 * **Support Email Template**
 *
 * Generates a HTML email template for support requests or feedback.
 *
 * @param SupportEmailTemplateProps - Component props.
 * @returns {JSX.Element} The rendered email template.
 */
const SupportEmailTemplate: React.FC<Readonly<SupportEmailTemplateProps>> = ({ email, message }): JSX.Element => {
    return (
        <Html>
            <Head />
            <Body
                role="document"
                style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif", padding: "20px" }}
            >
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
                    <Heading
                        as="h2"
                        style={{
                            borderBottom: "2px solid #2563eb",
                            color: "#333",
                            fontSize: "20px",
                            fontWeight: "600",
                            paddingBottom: "8px"
                        }}
                    >
                        Support/Feedback
                    </Heading>

                    <Text style={{ color: "#555", fontSize: "16px", marginTop: "16px" }}>
                        <strong>From:</strong> {email}
                    </Text>

                    <Section
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "6px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            marginTop: "12px",
                            padding: "16px"
                        }}
                    >
                        <Text style={{ color: "#333", fontSize: "16px", whiteSpace: "pre-wrap" }}>
                            <strong>Message:</strong> {message}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default SupportEmailTemplate;
