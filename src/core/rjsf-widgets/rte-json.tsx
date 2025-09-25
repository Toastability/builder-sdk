import { FieldProps } from '@rjsf/utils/lib/index.js';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/ui/shadcn/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/components/ui/dialog';

// Minimal TipTap JSON field that stores JSON (not HTML) in formData
export const RTEJsonField = ({ id, schema, uiSchema, formData, onChange }: FieldProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(formData || { type: 'doc', content: [] });
  const rteRef = useRef<HTMLDivElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right'], defaultAlignment: 'left' }),
      Underline,
      Placeholder.configure({
        placeholder: (uiSchema as any)?.['ui:placeholder'] || 'Enter content... (stored as JSON)',
        emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:absolute before:opacity-50 before:pointer-events-none',
      }),
    ],
    content: formData && typeof formData === 'object' ? formData : undefined,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
      if (!isModalOpen) setModalContent(json);
    },
    editorProps: { attributes: { class: 'prose prose-sm dark:prose-invert min-h-[100px] p-1 focus:outline-none' } },
  });

  useEffect(() => {
    if (rteRef.current && editor) {
      // Attach editor for possible data-binding integrations
      (rteRef.current as any).__chaiRTE = editor;
    }
  }, [editor]);

  useEffect(() => {
    if (formData && editor && typeof formData === 'object') {
      // external changes
      editor.commands.setContent(formData);
    }
  }, [formData]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (editor) editor.commands.setContent(modalContent);
  };

  return (
    <>
      <div className="relative">
        <div id={`chai-rte-json-${id}`} ref={rteRef} className="mt-1 rounded-md border border-input">
          <div className="flex items-center justify-end p-1">
            <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)}>Open Editor</Button>
          </div>
          <EditorContent editor={editor} id={id} />
        </div>
      </div>
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Rich Text Editor (JSON)</DialogTitle>
            </DialogHeader>
            <EditorContent editor={editor} className="min-h-[300px] rounded-md border border-input p-2" />
            <div className="mt-4 flex justify-end">
              <Button onClick={handleModalClose}>Done</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
