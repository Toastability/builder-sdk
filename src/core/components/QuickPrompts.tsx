import { LANGUAGES } from "@/core/constants/LANGUAGES";
import { useAskAi } from "@/core/hooks/use-ask-ai";
import { useLanguages } from "@/core/hooks/use-languages";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shadcn/components/ui/popover";
import { ArrowDownIcon, ArrowUpIcon, CheckIcon } from "@radix-ui/react-icons";
import { get } from "lodash-es";
import { FileEdit, Languages, Recycle, ShuffleIcon, SmileIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const QUICK_PROMPTS = [
  {
    name: "Improve writing",
    icon: FileEdit,
    prompt: "Improving writing in all text elements. Replacing placeholder content with meaningful relevant content.",
  },
  {
    name: "Replace placeholder content",
    icon: Recycle,
    prompt: "Discard current placeholder content and replace with meaningful relevant content.",
  },
  //TODO: Add tone options
  // {
  //   name: "Change tone",
  //   icon: MegaphoneIcon,
  //   subMenus: ["joyful", "serious", "angry", "sad", "excited", "relaxed", "confident", "assertive", "polite"],
  //   prompt: "Change tone in all text elements. Rewrite all text elements in a more _TONE_ tone.",
  // },
  {
    name: "Fix grammar",
    icon: CheckIcon,
    prompt: "Fix grammar in all text elements. Ensuring the text is grammatically correct and free of errors.",
  },
  {
    name: "Make longer",
    icon: ArrowUpIcon,
    prompt: "Make all text elements longer.",
  },
  {
    name: "Make shorter",
    icon: ArrowDownIcon,
    prompt: "Make all text elements shorter.",
  },
  {
    name: "Add emojis",
    icon: SmileIcon,
    prompt: "Add emojis to text elements if relevant.",
  },
  {
    name: "Randomize",
    icon: ShuffleIcon,
    prompt: "Randomize all text elements.",
  },
];

export function QuickPrompts({ onClick }: { onClick: (prompt: string) => void }) {
  const { loading } = useAskAi();
  const { t } = useTranslation();
  const { selectedLang, fallbackLang } = useLanguages();
  const quickPrompts = [...QUICK_PROMPTS];

  if (selectedLang && selectedLang !== fallbackLang) {
    quickPrompts.splice(0, 0, {
      name: `Translate to ${get(LANGUAGES, selectedLang, selectedLang)}`,
      icon: Languages,
      prompt: `Translate the content to ${get(LANGUAGES, selectedLang, selectedLang)}. Maintain same tone, style and length.`,
    });
  }

  return (
    <div className={(loading ? "pointer-events-none opacity-50 " : "") + "builder-sdk-quick-prompts"}>
      <ul className="space-y-2">
        {quickPrompts.map(({ name, icon: Icon, subMenus, prompt }: any) =>
          subMenus ? (
            <Popover>
              <PopoverTrigger asChild>
                <li
                  className="flex cursor-pointer items-center space-x-2 rounded p-1 pl-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  key={name}>
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </li>
              </PopoverTrigger>
              <PopoverContent side={"right"}>
                <ul>
                  <li>Happy</li>
                </ul>
              </PopoverContent>
            </Popover>
          ) : (
            <li
              onClick={() => onClick(prompt)}
              className="flex cursor-pointer items-center space-x-2 rounded p-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              key={name}>
              <Icon className="h-4 w-4" />
              <span>{t(name)}</span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
