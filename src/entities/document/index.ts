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
