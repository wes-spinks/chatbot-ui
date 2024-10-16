export interface CannedChatbot {
  displayName: string;
  id: string;
  llmConnection: { description: string; id: string; name: string };
  name: string;
  retrieverConnection: { id: string; name: string; description: string; index: string; metadataFields: string[] };
}
