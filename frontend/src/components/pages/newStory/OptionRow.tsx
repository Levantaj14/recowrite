import { Heading, HStack, IconButton, Menu, Portal } from '@chakra-ui/react';
import {
  MdCode,
  MdFormatBold,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdTitle,
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
      isBold: ctx.editor.isActive('bold'),
      isBlockquote: ctx.editor.isActive('blockquote'),
      isBulletList: ctx.editor.isActive('bulletList'),
      isOrderedList: ctx.editor.isActive('orderedList'),
      isHorizontalRule: ctx.editor.isActive('horizontalRule'),
      isCodeBlock: ctx.editor.isActive('codeBlock'),
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
    { level: '1', text: `${t('content.newStory.write.markdown.heading')} 1`, size: '4xl' as const },
    { level: '2', text: `${t('content.newStory.write.markdown.heading')} 2`, size: '2xl' as const },
    { level: '3', text: `${t('content.newStory.write.markdown.heading')} 3`, size: 'xl' as const },
    { level: '4', text: `${t('content.newStory.write.markdown.heading')} 4`, size: 'md' as const },
  ];

  return (
    <HStack gap={2} mt={4}>
      <Menu.Root positioning={{ placement: 'bottom-start' }}>
        <Menu.Trigger>
          <Tooltip content={t('content.newStory.write.markdown.heading')} openDelay={500} closeDelay={100}>
            <IconButton variant="outline" size="xs">
              <MdTitle />
            </IconButton>
          </Tooltip>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {headingOptions.map((option) => (
                <Menu.Item key={option.level} value={option.level} onClick={() => {}}>
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
  );
}
