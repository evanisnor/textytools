export type { Document, InputType, DetectableInputType } from "./types";

export {
  loadDocuments,
  saveDocuments,
  findDocumentById,
  removeDocumentById,
  updateDocument,
  addDocument,
} from "./storage";

export { generateId, generateDocumentName, createDocument } from "./factory";

export { useDocumentState } from "./useDocumentState";
export type {
  DocumentStateManager,
  DocumentIntent,
  DocumentCreatedIntent,
  DocumentDeletedIntent,
} from "./useDocumentState";
