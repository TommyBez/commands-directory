'use client'

import { AnimatePresence, motion } from 'motion/react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { toast } from 'sonner'
import type { BundledLanguage } from '@/components/kibo-ui/code-block'
import {
  Snippet,
  SnippetCopyButton,
  SnippetHeader,
  SnippetTabsContent,
  SnippetTabsList,
  SnippetTabsTrigger,
} from '@/components/kibo-ui/snippet'
import { McpIcon } from '@/components/mcp-icon'
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from '@/components/responsive-modal'
import { Button } from '@/components/ui/button'
import { promptDeeplink } from './prompt'

// Lazy load CodeBlock components to reduce initial bundle size
const CodeBlock = dynamic(
  () =>
    import('@/components/kibo-ui/code-block').then((mod) => ({
      default: mod.CodeBlock,
    })),
  { ssr: false },
)
const CodeBlockHeader = dynamic(
  () =>
    import('@/components/kibo-ui/code-block').then((mod) => ({
      default: mod.CodeBlockHeader,
    })),
  { ssr: false },
)
const CodeBlockFiles = dynamic(
  () =>
    import('@/components/kibo-ui/code-block').then((mod) => ({
      default: mod.CodeBlockFiles,
    })),
  { ssr: false },
)
const CodeBlockFilename = dynamic(
  () =>
    import('@/components/kibo-ui/code-block').then((mod) => ({
      default: mod.CodeBlockFilename,
    })),
  { ssr: false },
)
const CodeBlockCopyButton = dynamic(
  () =>
    import('@/components/kibo-ui/code-block').then((mod) => ({
      default: mod.CodeBlockCopyButton,
    })),
  { ssr: false },
)
const CodeBlockBody = dynamic(
  () =>
    import('@/components/kibo-ui/code-block').then((mod) => ({
      default: mod.CodeBlockBody,
    })),
  { ssr: false },
)
const CodeBlockItem = dynamic(
  () =>
    import('@/components/kibo-ui/code-block').then((mod) => ({
      default: mod.CodeBlockItem,
    })),
  { ssr: false },
)
const CodeBlockContent = dynamic(
  () =>
    import('@/components/kibo-ui/code-block').then((mod) => ({
      default: mod.CodeBlockContent,
    })),
  { ssr: false },
)

const commands = [
  {
    label: 'pnpm',
    code: 'pnpx shadcn mcp init',
  },
  {
    label: 'npm',
    code: 'npx shadcn mcp init',
  },
  {
    label: 'yarn',
    code: 'yarn dlx shadcn mcp init',
  },
  {
    label: 'bun',
    code: 'bunx shadcn mcp init',
  },
]

export const McpModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [value, setValue] = useState(commands[0].label)
  const [activeTab, setActiveTab] = useState<'cursor' | 'manual'>('cursor')
  const activeCommand = commands.find((command) => command.label === value)

  const namespaceJson = JSON.stringify(
    {
      registries: {
        '@cursor-commands': 'https://cursor-commands.com/r/{name}',
      },
    },
    null,
    2,
  )

  const namespaceCode = [
    {
      language: 'json' as BundledLanguage,
      filename: 'components.json',
      code: namespaceJson,
    },
  ]

  return (
    <ResponsiveModal onOpenChange={setIsModalOpen} open={isModalOpen}>
      <Button onClick={() => setIsModalOpen(true)} variant="outline">
        <McpIcon className="size-4" />
        MCP
      </Button>
      <ResponsiveModalContent className="transition-all duration-300 ease-in-out sm:max-w-[600px]">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle className="font-semibold text-xl">
            Setup MCP
          </ResponsiveModalTitle>
          <ResponsiveModalDescription className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            Choose your preferred installation method below.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        {/* Tab Switcher */}
        <div className="flex gap-1 border-gray-200 border-b px-2 md:px-4 dark:border-gray-800">
          <button
            className={`relative px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'cursor'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('cursor')}
            type="button"
          >
            Cursor Installation
            {activeTab === 'cursor' && (
              <motion.div
                className="absolute right-0 bottom-0 left-0 h-0.5 bg-gray-900 dark:bg-gray-100"
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            className={`relative px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'manual'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('manual')}
            type="button"
          >
            Manual Installation
            {activeTab === 'manual' && (
              <motion.div
                className="absolute right-0 bottom-0 left-0 h-0.5 bg-gray-900 dark:bg-gray-100"
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="relative flex-1 overflow-y-auto px-2 pb-2 md:px-4 md:pb-4">
          <AnimatePresence mode="wait">
            {activeTab === 'cursor' && (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="mt-6 space-y-4"
                exit={{ opacity: 0, x: 20 }}
                initial={{ opacity: 0, x: -20 }}
                key="cursor"
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="mb-2 font-semibold text-lg">
                    One-Click Setup with Cursor
                  </h3>
                  <p className="mb-4 text-gray-600 text-sm dark:text-gray-400">
                    Click the button below to automatically configure the MCP
                    registry in your Cursor IDE. The AI will handle all the
                    setup steps for you.
                  </p>
                  <Button asChild className="w-full" size="lg">
                    <a href={promptDeeplink}>
                      <McpIcon className="mr-2 size-4" />
                      Setup with Cursor AI
                    </a>
                  </Button>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                  <p className="text-blue-900 text-sm dark:text-blue-100">
                    <strong>Note:</strong> This will open a Cursor AI composer
                    window with pre-configured setup instructions. Make sure you
                    have Cursor IDE installed on your system.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'manual' && (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="mt-6 space-y-6"
                exit={{ opacity: 0, x: 20 }}
                initial={{ opacity: 0, x: -20 }}
                key="manual"
                transition={{ duration: 0.2 }}
              >
                <div>
                  <h3 className="mb-2 font-medium text-md">
                    1. Add namespace to components.json
                  </h3>
                  <CodeBlock
                    data={namespaceCode}
                    defaultValue={namespaceCode[0].language}
                  >
                    <CodeBlockHeader>
                      <CodeBlockFiles>
                        {(item) => (
                          <CodeBlockFilename
                            key={item.language}
                            value={item.language}
                          >
                            {item.filename}
                          </CodeBlockFilename>
                        )}
                      </CodeBlockFiles>
                      <CodeBlockCopyButton
                        onCopy={() => toast.info('Copied to clipboard')}
                        onError={() =>
                          toast.error('Failed to copy code to clipboard')
                        }
                      />
                    </CodeBlockHeader>
                    <CodeBlockBody>
                      {(item) => (
                        <CodeBlockItem
                          key={item.language}
                          value={item.language}
                        >
                          <CodeBlockContent
                            language={item.language as BundledLanguage}
                          >
                            {item.code}
                          </CodeBlockContent>
                        </CodeBlockItem>
                      )}
                    </CodeBlockBody>
                  </CodeBlock>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-md">
                    2. Install MCP Server
                  </h3>
                  <Snippet onValueChange={setValue} value={value}>
                    <SnippetHeader>
                      <SnippetTabsList>
                        {commands.map((command) => (
                          <SnippetTabsTrigger
                            key={command.label}
                            value={command.label}
                          >
                            {command.label}
                          </SnippetTabsTrigger>
                        ))}
                      </SnippetTabsList>
                      {activeCommand && (
                        <SnippetCopyButton
                          onCopy={() => toast.info('Copied to clipboard')}
                          onError={() =>
                            toast.error('Failed to copy code to clipboard')
                          }
                          value={activeCommand.code}
                        />
                      )}
                    </SnippetHeader>
                    {commands.map((command) => (
                      <SnippetTabsContent
                        key={command.label}
                        value={command.label}
                      >
                        {command.code}
                      </SnippetTabsContent>
                    ))}
                  </Snippet>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Close functionality is automatically handled by ResponsiveModal */}
      </ResponsiveModalContent>
    </ResponsiveModal>
  )
}

// Example of how to use it if this were a page (for Storybook or testing)
// export default function McpModalPage() {
//   return (
//     <div className="p-10">
//       <McpModal />
//     </div>
//   );
// }
