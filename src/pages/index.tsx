import Layout from "@/components/layout/Layout";
import {ChatGPT} from "@/components/chat/ChatGPT";

export default function HomePage() {
    return (
        <main>
            <Layout>
                <ChatGPT/>
            </Layout>
        </main>
    );
}