import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Hr,
} from "@react-email/components";

interface OtpEmailProps {
  code: string;
}

export function OtpEmail({ code }: OtpEmailProps) {
  return (
    <Html lang="en">
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
        <Container
          style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 24px" }}
        >
          <Heading style={{ fontSize: "24px", fontWeight: 700, color: "#111" }}>
            Your sign-in code
          </Heading>
          <Section>
            <Text style={{ color: "#555" }}>
              Use the code below to sign in. It expires in 10 minutes.
            </Text>
            <Text
              style={{
                fontSize: "36px",
                fontWeight: 700,
                letterSpacing: "10px",
                color: "#111",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              {code}
            </Text>
            <Hr />
            <Text style={{ color: "#999", fontSize: "13px" }}>
              If you didn't request this, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
