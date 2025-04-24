import { ChatContainer } from "@/components/chat-container";
import { Helmet } from "react-helmet";

export default function ChatPage() {
  return (
    <>
      <Helmet>
        <title>NANA-AI - Assistant IA professionnel pour entreprise</title>
        <meta name="description" content="Assistant IA professionnel pour entreprise avec intégration à Gmail, Calendar et Outlook" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </Helmet>
      <ChatContainer />
    </>
  );
}
