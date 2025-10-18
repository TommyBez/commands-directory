'use client'

import { AnimatePresence, motion } from 'motion/react'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import type { BundledLanguage } from '@/components/kibo-ui/code-block'
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
} from '@/components/kibo-ui/code-block'
import { McpIcon } from '@/components/mcp-icon'
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from '@/components/responsive-modal'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Generate Cursor deeplink for MCP installation
const generateCursorDeeplink = (name: string, config: object): string => {
  const configString = JSON.stringify(config)

  // UTF-8 safe base64 encoding
  const encoder = new TextEncoder()
  const uint8Array = encoder.encode(configString)
  const binaryString = Array.from(uint8Array, (byte) =>
    String.fromCharCode(byte),
  ).join('')
  const base64Config = btoa(binaryString)

  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(name)}&config=${base64Config}`
}

export const McpModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ide, setIde] = useState<'cursor' | 'windsurf'>('cursor')

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.info('Copied to clipboard')
      },
      () => {
        toast.error('Failed to copy code')
      },
    )
  }

  const handleCursorDeeplinkClick = () => {
    toast.info('Opening Cursor to install MCP server...')
  }

  // Individual server configuration for deeplink
  const serverConfig = {
    command: 'npx',
    args: ['shadcn@latest', 'mcp'],
  }

  // Full MCP configuration for manual setup
  const mcpJson = JSON.stringify(
    {
      mcpServers: {
        shadcn: serverConfig,
      },
    },
    null,
    2,
  )

  const namespaceJson = JSON.stringify(
    {
      registries: {
        '@cursor-commands': 'https://cursor-commands.com/registry/{name}.json',
      },
    },
    null,
    2,
  )

  // Generate Cursor deeplink
  const cursorDeeplink = generateCursorDeeplink('shadcn', serverConfig)

  // Code block data for MCP configuration
  const mcpCode = [
    {
      language: 'json' as BundledLanguage,
      filename: '.codeium/windsurf/mcp_config.json',
      code: mcpJson,
    },
  ]

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
                    onCopy={() => handleCopy(namespaceJson)}
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
              <Tabs
                onValueChange={(value) =>
                  setIde(value as 'cursor' | 'windsurf')
                }
                value={ide}
              >
                <TabsList className="grid w-full grid-cols-2 sm:inline-flex sm:w-auto">
                  <TabsTrigger value="cursor">Cursor</TabsTrigger>
                  <TabsTrigger value="windsurf">Windsurf</TabsTrigger>
                </TabsList>

                <motion.div
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  layout
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <AnimatePresence mode="wait">
                    {ide === 'cursor' && (
                      <motion.div
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 space-y-4 overflow-hidden"
                        exit={{ opacity: 0, height: 0 }}
                        initial={{ opacity: 0, height: 0 }}
                        key="cursor"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        {/* One-click install for Cursor */}
                        <div className="rounded-lg border p-4">
                          <h4 className="mb-2 font-medium text-sm">
                            One-click install
                          </h4>
                          <p className="mb-3 text-muted-foreground text-xs">
                            Click the badge to automatically install the MCP
                            server in Cursor.
                          </p>
                          <Link
                            className="inline-block"
                            href={cursorDeeplink as Route}
                            onClick={handleCursorDeeplinkClick}
                          >
                            <Image
                              alt="Install shadcn MCP in Cursor"
                              className="h-auto rounded-md transition-opacity hover:opacity-80"
                              height={50}
                              src="https://cursor.com/deeplink/mcp-install-dark.svg"
                              width={200}
                            />
                          </Link>
                        </div>
                      </motion.div>
                    )}

                    {ide === 'windsurf' && (
                      <motion.div
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 overflow-hidden"
                        exit={{ opacity: 0, height: 0 }}
                        initial={{ opacity: 0, height: 0 }}
                        key="windsurf"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div>
                          <p className="mb-2 text-gray-600 text-sm dark:text-gray-400">
                            Copy and paste the code into
                            .codeium/windsurf/mcp_config.json
                          </p>
                          <CodeBlock
                            data={mcpCode}
                            defaultValue={mcpCode[0].language}
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
                                onCopy={() => handleCopy(mcpJson)}
                                onError={() =>
                                  toast.error(
                                    'Failed to copy code to clipboard',
                                  )
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Tabs>
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
