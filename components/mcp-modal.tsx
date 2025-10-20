'use client'

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
  const activeCommand = commands.find((command) => command.label === value)

  const namespaceJson = JSON.stringify(
    {
      registries: {
        '@cursor-commands': 'https://cursor-commands.com/r/{name}.json',
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
            Use the code below to configure the registry MCP in your IDE.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <div className="flex-1 overflow-y-auto px-2 pb-2 md:px-4 md:pb-4">
          <div className="mt-6 space-y-6">
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
                    <CodeBlockItem key={item.language} value={item.language}>
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
                  <SnippetTabsContent key={command.label} value={command.label}>
                    {command.code}
                  </SnippetTabsContent>
                ))}
              </Snippet>
            </div>
          </div>
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
