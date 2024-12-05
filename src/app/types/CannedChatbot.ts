export interface CannedChatbot {
  displayName?: string;
  description?: string;
  id?: string;
  llmConnection: { description: string; id: string; name: string };
  name: string;
  userPrompt?: string;
  exampleQuestions?: string[];
  retrieverConnection?: { id: string; name: string; description: string; index: string; metadataFields: string[] };
}
