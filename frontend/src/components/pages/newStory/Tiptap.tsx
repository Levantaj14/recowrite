import { Box, useRecipe } from '@chakra-ui/react';
import { Prose } from '@/components/ui/prose';
import { Editor, EditorContent } from '@tiptap/react';

const Tiptap = ({ editor, error }: { editor: Editor | null; error: boolean }) => {
  const recipe = useRecipe({ key: 'textarea' });
  const textareaStyles = recipe({ variant: 'outline' });

  return (
    <Box
      id="content-container"
      mt="2"
      css={{
        ...textareaStyles,
        borderColor: error ? 'red.500' : textareaStyles.borderColor,
        height: 'calc(100vh - 400px)',
        overflowY: 'auto',
        cursor: 'text',
        display: 'block',
        padding: '0',
        _focusWithin: {
          outline: '1px solid',
          outlineColor: error ? 'red.500' : 'colorPalette.focusRing',
        },
      }}
      onClick={() => editor?.chain().focus().run()}
    >
      <Prose
        padding="4"
        maxWidth="none"
        css={{
          '& .ProseMirror': {
            outline: 'none',
            minHeight: '100%',
          },
          '& .ProseMirror p.is-editor-empty:first-of-type::before': {
            content: 'attr(data-placeholder)',
            float: 'left',
            color: 'fg.muted',
            pointerEvents: 'none',
            height: 0,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Prose>
    </Box>
  );
};

export default Tiptap;
