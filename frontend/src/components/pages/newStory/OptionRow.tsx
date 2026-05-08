import { Heading, HStack, IconButton, Menu, Portal } from '@chakra-ui/react';
import {
  MdBorderColor,
  MdCode,
  MdFormatBold,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatUnderlined,
  MdRedo,
  MdTitle,
  MdUndo,
} from 'react-icons/md';
import { Tooltip } from '@/components/ui/tooltip.tsx';
import { TfiLayoutLineSolid } from 'react-icons/tfi';
import { useTranslation } from 'react-i18next';
import { Editor, useEditorState } from '@tiptap/react';

export function OptionRow({ editor }: { editor: Editor }) {
  const { t } = useTranslation();
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isUndo: ctx.editor.can().undo(),
      isRedo: ctx.editor.can().redo(),
      isHeading: ctx.editor.isActive('heading'),
      isBold: ctx.editor.isActive('bold'),
      isUnderline: ctx.editor.isActive('underline'),
      isHighlight: ctx.editor.isActive('highlight'),
      isBlockquote: ctx.editor.isActive('blockquote'),
      isBulletList: ctx.editor.isActive('bulletList'),
      isOrderedList: ctx.editor.isActive('orderedList'),
      isHorizontalRule: ctx.editor.isActive('horizontalRule'),
      isCodeBlock: ctx.editor.isActive('codeBlock'),
      isLink: ctx.editor.isActive('link'),
    }),
  });

  const buttons = [
    {
      icon: <MdFormatBold />,
      tooltip: t('content.newStory.write.markdown.bold'),
      action: () => editor.commands.toggleBold(),
      active: editorState.isBold,
    },
    {
      icon: <MdFormatUnderlined />,
      tooltip: t('content.newStory.write.markdown.underline'),
      action: () => editor.commands.toggleUnderline(),
      active: editorState.isUnderline,
    },
    {
      icon: <MdBorderColor />,
      tooltip: t('content.newStory.write.markdown.highlight'),
      action: () => editor.commands.toggleHighlight(),
      active: editorState.isHighlight,
    },
    {
      icon: <MdFormatQuote />,
      tooltip: t('content.newStory.write.markdown.quote'),
      action: () => editor.commands.toggleBlockquote(),
      active: editorState.isBlockquote,
    },
    {
      icon: <MdFormatListBulleted />,
      tooltip: t('content.newStory.write.markdown.unorderedList'),
      action: () => editor.commands.toggleBulletList(),
      active: editorState.isBulletList,
    },
    {
      icon: <MdFormatListNumbered />,
      tooltip: t('content.newStory.write.markdown.orderedList'),
      action: () => editor.commands.toggleOrderedList(),
      active: editorState.isOrderedList,
    },
    {
      icon: <TfiLayoutLineSolid />,
      tooltip: t('content.newStory.write.markdown.hr'),
      action: () => editor.commands.setHorizontalRule(),
      active: editorState.isHorizontalRule,
    },
    {
      icon: <MdCode />,
      tooltip: t('content.newStory.write.markdown.code.tooltip'),
      action: () => editor.commands.toggleCodeBlock(),
      active: editorState.isCodeBlock,
    },
  ];

  const headingOptions = [
    { level: '2', text: `${t('content.newStory.write.markdown.heading')} 1`, size: '2xl' as const },
    { level: '3', text: `${t('content.newStory.write.markdown.heading')} 2`, size: 'xl' as const },
    { level: '4', text: `${t('content.newStory.write.markdown.heading')} 3`, size: 'md' as const },
    { level: '5', text: `${t('content.newStory.write.markdown.heading')} 4`, size: 'sm' as const },
  ];

  return (
    <HStack mt={4} mb={1} divideX="2px">
      <HStack gap={2} pr={1}>
        <Tooltip key="undo" content={t('content.newStory.write.markdown.undo')} openDelay={500} closeDelay={100}>
          <IconButton
            size="xs"
            variant="outline"
            disabled={!editorState.isUndo}
            onClick={() => editor.commands.undo()}
            aria-label={t('content.newStory.write.markdown.undo')}
          >
            <MdUndo />
          </IconButton>
        </Tooltip>
        <Tooltip key="redo" content={t('content.newStory.write.markdown.redo')} openDelay={500} closeDelay={100}>
          <IconButton
            size="xs"
            variant="outline"
            disabled={!editorState.isRedo}
            onClick={() => editor.commands.redo()}
            aria-label={t('content.newStory.write.markdown.redo')}
          >
            <MdRedo />
          </IconButton>
        </Tooltip>
      </HStack>

      <HStack gap={2} pl={3}>
        <Menu.Root positioning={{ placement: 'bottom-start' }}>
          <Menu.Trigger>
            <Tooltip content={t('content.newStory.write.markdown.heading')} openDelay={500} closeDelay={100}>
              <IconButton variant={editorState.isHeading ? 'solid' : 'outline'} size="xs">
                <MdTitle />
              </IconButton>
            </Tooltip>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {headingOptions.map((option) => (
                  <Menu.Item
                    key={option.level}
                    value={option.level}
                    onClick={() => editor.commands.toggleHeading({ level: Number(option.level) as 2 | 3 | 4 | 5 })}
                  >
                    <Heading size={option.size}>{option.text}</Heading>
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>

        {buttons.map((button) => (
          <Tooltip key={button.tooltip} content={button.tooltip} openDelay={500} closeDelay={100}>
            <IconButton
              size="xs"
              variant={button.active ? 'solid' : 'outline'}
              onClick={button.action}
              aria-label={button.tooltip}
            >
              {button.icon}
            </IconButton>
          </Tooltip>
        ))}
      </HStack>
    </HStack>
  );
}
