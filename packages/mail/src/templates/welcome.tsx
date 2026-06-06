import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Button,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
        <Container
          style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 24px" }}
        >
          <Heading style={{ fontSize: "24px", fontWeight: 700, color: "#111" }}>
            Welcome, {name}!
          </Heading>
          <Text style={{ color: "#555" }}>
            Your InteractiveTasks account is ready. Start generating interactive
            learning tasks in seconds.
          </Text>
          <Button
            href={process.env.AUTH_URL ?? "https://yourapp.com"}
            style={{
              backgroundColor: "#111",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Open InteractiveTasks
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
