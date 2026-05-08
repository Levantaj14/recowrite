import { Box, useRecipe } from '@chakra-ui/react';
import { Placeholder } from '@tiptap/extensions';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTranslation } from 'react-i18next';
import Typography from '@tiptap/extension-typography';
import { Prose } from '@/components/ui/prose';

const Tiptap = () => {
  const { t } = useTranslation();
  const recipe = useRecipe({ key: 'textarea' });
  const textareaStyles = recipe({ variant: 'outline' });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: t('content.newStory.write.placeholder'),
      }),
      Typography,
    ],
  });

  return (
    <Box
      id="content-container"
      mt="2"
      css={{
        ...textareaStyles,
        height: 'calc(100vh - 400px)',
        overflowY: 'auto',
        cursor: 'text',
        display: 'block',
        padding: '0',
        _focusWithin: {
          outline: '2px solid',
          outlineColor: 'colorPalette.focusRing',
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
