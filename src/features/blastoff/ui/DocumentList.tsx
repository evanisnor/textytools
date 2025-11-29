/**
 * Document List
 * Side panel showing all saved documents
 */

"use client";

import { useRouter, useParams } from "next/navigation";

import { useBlastoffContext } from "../model/BlastoffProvider";

export function DocumentList() {
  const router = useRouter();
  const params = useParams();
  const { documents, deleteDocument, setInputText, createDocument } =
    useBlastoffContext();

  const currentDocId = params.id as string | undefined;

  const handleSelectDocument = (id: string) => {
    router.push(`/blastoff/${id}`);
  };

  const handleCreateDocument = () => {
    const newId = createDocument("");
    router.push(`/blastoff/${newId}`);
  };

  const handleDeleteDocument = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteDocument(id);
    if (currentDocId === id) {
      // Clear input text and navigate to initial state
      setInputText("");
      router.push("/blastoff");
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Documents</h2>
          <button
            onClick={handleCreateDocument}
            className="w-6 h-6 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors text-lg leading-none"
            title="New document"
          >
            +
          </button>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-2">
        {documents.length === 0 ? (
          <div className="text-center text-sm text-zinc-400 dark:text-zinc-600 mt-8">
            No documents yet
          </div>
        ) : (
          <div className="space-y-1">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleSelectDocument(doc.id)}
                className={`group p-3 rounded-md cursor-pointer transition-colors ${
                  currentDocId === doc.id
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {doc.name}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                      {doc.transforms.length} transform
                      {doc.transforms.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteDocument(e, doc.id)}
                    className="shrink-0 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity text-xl leading-none"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-600 mt-2">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
