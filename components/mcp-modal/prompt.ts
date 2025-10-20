const prompt = `
You are tasked with setting up shadcn MCP and configuring a custom registry in a JavaScript/TypeScript project. Follow these steps in order:

### Step 1: Initialize shadcn MCP
Run the following command in the terminal:
\`\`\`bash
npx shadcn mcp init --client cursor
\`\`\`

Wait for the command to complete before proceeding.

### Step 2: Locate components.json
Search for the \`components.json\` file in the project root directory using the \`file_search\` tool with query "components.json".

### Step 3: Handle Missing components.json
If \`components.json\` is NOT found after Step 1:
- Run \`npx shadcn@latest init -d\` in the terminal
- Follow any prompts to configure shadcn
- Wait for the command to complete
- Verify that \`components.json\` now exists in the project root

### Step 4: Update components.json with Registry Configuration
Once \`components.json\` exists (either found or created), read the file and modify it:

**Case A: If the \`registries\` property does NOT exist:**
- Add the entire \`registries\` object to the JSON at the root level:
\`\`\`json
"registries": {
  "@cursor-commands": "https://www.cursor-commands.com/r/{name}"
}
\`\`\`

**Case B: If the \`registries\` property ALREADY exists:**
- Add only the \`@cursor-commands\` entry to the existing \`registries\` object:
\`\`\`json
"@cursor-commands": "https://www.cursor-commands.com/r/{name}"
\`\`\`
- Preserve all existing registry entries (e.g., \`@kibo-ui\` or others)

**Important:**
- Maintain the exact formatting and structure of the existing JSON
- Preserve all other properties in \`components.json\`
- Ensure the final JSON is valid (proper comma placement, no trailing commas if it's the last property)
- The URL must use \`{name}\` as a placeholder (not \`{name}.json\`)

### Step 5: Verify
After updating \`components.json\`, read the file again to confirm:
1. The \`registries\` object exists
2. The \`@cursor-commands\` entry is present with the correct URL
3. All existing registries are preserved
4. The JSON is valid

### Error Handling
- If any command fails, report the error clearly
- If \`components.json\` cannot be created, explain why
- If JSON parsing fails, show the parsing error and the problematic content

### Success Criteria
- \`npx shadcn mcp init\` executed successfully
- \`components.json\` exists in the project
- The \`@cursor-commands\` registry is properly configured
- All existing configuration is preserved
`

function generatePromptDeeplink(promptText: string): string {
  const url = new URL('cursor://anysphere.cursor-deeplink/prompt')
  url.searchParams.set('text', promptText)
  return url.toString()
}

export const promptDeeplink = generatePromptDeeplink(prompt)
