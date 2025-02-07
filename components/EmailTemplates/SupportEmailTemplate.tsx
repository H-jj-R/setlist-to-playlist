import { Html, Head, Body, Container, Heading, Text, Section } from "@react-email/components";

interface SupportEmailTemplateProps {
    email: string;
    message: string;
}

/**
 *
 */
const SupportEmailTemplate: React.FC<Readonly<SupportEmailTemplateProps>> = ({ email, message }) => {
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
                    <Heading
                        as="h2"
                        style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#333",
                            borderBottom: "2px solid #2563eb",
                            paddingBottom: "8px"
                        }}
                    >
                        Support/Feedback
                    </Heading>

                    <Text style={{ fontSize: "16px", color: "#555", marginTop: "16px" }}>
                        <strong>From:</strong> {email}
                    </Text>

                    <Section
                        style={{
                            backgroundColor: "#ffffff",
                            padding: "16px",
                            borderRadius: "6px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            marginTop: "12px"
                        }}
                    >
                        <Text style={{ fontSize: "16px", color: "#333", whiteSpace: "pre-wrap" }}>
                            <strong>Message:</strong> {message}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default SupportEmailTemplate;
