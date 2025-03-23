import { Heading, HStack, IconButton, Menu, Portal, Spacer } from '@chakra-ui/react';
import {
  MdCode,
  MdFormatBold,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote, MdOutlineImage,
  MdOutlineInsertLink,
  MdTitle,
} from 'react-icons/md';
import { Tooltip } from '@/components/ui/tooltip.tsx';
import { TfiLayoutLineSolid } from 'react-icons/tfi';
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { NewStoryFormFields } from '@/components/pages/newStory/NewStory.tsx';
import { useTranslation } from 'react-i18next';
import { HiOutlineInformationCircle } from 'react-icons/hi';

type Props = {
  setValue: UseFormSetValue<NewStoryFormFields>;
  getValues: UseFormGetValues<NewStoryFormFields>;
};

export function OptionRow({ setValue, getValues }: Props) {
  const { t } = useTranslation();

  const getTextareaInfo = () => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return null;

    return {
      textarea,
      value: getValues('content'),
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      hasSelection: textarea.selectionStart !== textarea.selectionEnd,
    };
  };

  const updateTextarea = (newText: string, newCursorPos?: number) => {
    setValue('content', newText);

    setTimeout(() => {
      const textarea = document.getElementById('content') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        if (newCursorPos !== undefined) {
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }
      }
    }, 0);
  };

  const wrapText = (prefix: string, suffix: string = prefix, placeholder: string = '') => {
    const info = getTextareaInfo();
    if (!info) return;

    const { value, start, end, hasSelection } = info;
    const selectedText = hasSelection ? value.substring(start, end) : placeholder;
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);

    const newCursorPos = hasSelection ? start + prefix.length + selectedText.length + suffix.length : start + prefix.length + placeholder.length;

    updateTextarea(newText, newCursorPos);
  };

  const insertText = (text: string) => {
    const info = getTextareaInfo();
    if (!info) return;

    const { value, end } = info;
    const newText = value.substring(0, end) + text + value.substring(end);
    const newCursorPos = end + text.length;

    updateTextarea(newText, newCursorPos);
  };

  const prefixLines = (prefix: string) => {
    const info = getTextareaInfo();
    if (!info) return;

    const { value, start, end, hasSelection } = info;

    if (hasSelection) {
      const selectedText = value.substring(start, end);
      const lines = selectedText.split('\n');

      const modifiedLines = lines.map(line =>
        line.trimStart().startsWith(prefix.trimEnd()) ? line : prefix + line);

      const modifiedText = modifiedLines.join('\n');
      const newText = value.substring(0, start) + modifiedText + value.substring(end);

      updateTextarea(newText, start + modifiedText.length);
    } else {
      const beforeCursor = value.substring(0, start);
      const afterCursor = value.substring(start);

      const lastNewlineBeforeCursor = beforeCursor.lastIndexOf('\n');
      const lineStart = lastNewlineBeforeCursor === -1 ? 0 : lastNewlineBeforeCursor + 1;

      const currentLine = beforeCursor.substring(lineStart);
      if (currentLine.trimStart().startsWith(prefix.trimEnd())) {
        return;
      }

      const newText =
        beforeCursor.substring(0, lineStart) +
        prefix +
        beforeCursor.substring(lineStart) +
        afterCursor;

      updateTextarea(newText, start + prefix.length);
    }
  };

  const buttons = [
    { icon: <MdFormatBold />, tooltip: t('newStory.write.markdown.bold'), action: () => wrapText('**') },
    { icon: <MdFormatQuote />, tooltip: t('newStory.write.markdown.quote'), action: () => prefixLines('> ') },
    {
      icon: <MdFormatListBulleted />,
      tooltip: t('newStory.write.markdown.unorderedList'),
      action: () => prefixLines('- '),
    },
    {
      icon: <MdFormatListNumbered />,
      tooltip: t('newStory.write.markdown.orderedList'),
      action: () => prefixLines('1. '),
    },
    { icon: <TfiLayoutLineSolid />, tooltip: t('newStory.write.markdown.hr'), action: () => insertText('\n\n---\n\n') },
    {
      icon: <MdOutlineInsertLink />,
      tooltip: t('newStory.write.markdown.link.tooltip'),
      action: () => wrapText('[', '](URL)', t('newStory.write.markdown.link.title')),
    },
    {
      icon: <MdOutlineImage />,
      tooltip: t('newStory.write.markdown.image.tooltip'),
      action: () => insertText(`![${t('newStory.write.markdown.image.alt')}](${t('newStory.write.markdown.image.url')})`),
    },
    {
      icon: <MdCode />,
      tooltip: t('newStory.write.markdown.code.tooltip'),
      action: () => wrapText('\n```\n', '\n```\n', t('newStory.write.markdown.code.text')),
    },
  ];

  const headingOptions = [
    { level: '1', text: `${t('newStory.write.markdown.heading')} 1`, size: '4xl' as const },
    { level: '2', text: `${t('newStory.write.markdown.heading')} 2`, size: '2xl' as const },
    { level: '3', text: `${t('newStory.write.markdown.heading')} 3`, size: 'xl' as const },
    { level: '4', text: `${t('newStory.write.markdown.heading')} 4`, size: 'md' as const },
  ];

  return (
    <HStack gap={2} mt={4}>
      <Menu.Root positioning={{ placement: 'bottom-start' }}>
        <Menu.Trigger>
          <Tooltip content={t('newStory.write.markdown.heading')} openDelay={500} closeDelay={100}>
            <IconButton variant="outline" size="xs">
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
                  onClick={() => prefixLines('#'.repeat(Number(option.level)) + ' ')}
                >
                  <Heading size={option.size}>{option.text}</Heading>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      {buttons.map((button) => (
        <Tooltip
          key={button.tooltip}
          content={button.tooltip}
          openDelay={500}
          closeDelay={100}
        >
          <IconButton
            size="xs"
            variant="outline"
            onClick={button.action}
            aria-label={button.tooltip}
          >
            {button.icon}
          </IconButton>
        </Tooltip>
      ))}
      <Spacer />
      <Tooltip
        key={'info'}
        content={t('newStory.write.markdown.info')}
        openDelay={500}
        closeDelay={100}
      >
        <IconButton
          size="xs"
          variant="outline"
          onClick={() => window.open("https://www.markdownguide.org/basic-syntax", "_blank")}
          aria-label={'info'}
        >
          <HiOutlineInformationCircle />
        </IconButton>
      </Tooltip>
    </HStack>
  );
}