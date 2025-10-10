import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db";
import {
	commands,
	categories,
	commandTags,
	commandTagMap,
	type NewCommand,
	type NewCategory,
	type NewCommandTag,
} from "../db/schema";

async function seed() {
	console.log("🌱 Seeding database...");

	// Seed Categories
	const categoryData: NewCategory[] = [
		{
			name: "Development Workflow",
			slug: "development-workflow",
			description: "Commands for managing your development process",
		},
		{
			name: "Code Quality",
			slug: "code-quality",
			description: "Commands for reviewing and improving code quality",
		},
		{
			name: "Testing",
			slug: "testing",
			description: "Commands for testing and debugging",
		},
		{
			name: "Project Setup",
			slug: "project-setup",
			description: "Commands for setting up new features and projects",
		},
		{
			name: "Team Collaboration",
			slug: "team-collaboration",
			description: "Commands for onboarding and collaboration",
		},
	];

	console.log("Inserting categories...");
	const insertedCategories = await db
		.insert(categories)
		.values(categoryData)
		.returning();

	// Seed Tags
	const tagData: NewCommandTag[] = [
		{ name: "Git", slug: "git" },
		{ name: "Review", slug: "review" },
		{ name: "Testing", slug: "testing" },
		{ name: "Security", slug: "security" },
		{ name: "Setup", slug: "setup" },
		{ name: "Documentation", slug: "documentation" },
		{ name: "Onboarding", slug: "onboarding" },
	];

	console.log("Inserting tags...");
	const insertedTags = await db.insert(commandTags).values(tagData).returning();

	// Seed Commands with Markdown content
	const commandsData: NewCommand[] = [
		{
			slug: "create-pull-request",
			title: "Create Pull Request",
			description: "Create a comprehensive pull request with proper context",
			content: `# Create Pull Request

## Overview
Create a well-structured pull request with all necessary context and information for reviewers.

## Steps

1. **Review your changes**
   - Run \`git diff\` to see all modifications
   - Ensure all changes are intentional
   - Check for any debug code or temporary changes

2. **Write a descriptive title**
   - Use present tense (e.g., "Add user authentication")
   - Keep it concise but informative
   - Reference ticket number if applicable

3. **Provide context**
   - Explain WHY this change is needed
   - Describe WHAT was changed
   - Mention any breaking changes

4. **Add testing notes**
   - List steps to test the changes
   - Include edge cases
   - Mention any setup requirements

## Checklist
- [ ] All tests pass
- [ ] Code follows project style guide
- [ ] Documentation updated if needed
- [ ] No sensitive data in the code
- [ ] Branch is up to date with main`,
			categoryId: insertedCategories[0].id,
		},
		{
			slug: "code-review-checklist",
			title: "Code Review Checklist",
			description: "Comprehensive checklist for reviewing code changes",
			content: `# Code Review Checklist

## Overview
Systematic approach to reviewing pull requests and code changes.

## Code Quality

### Readability
- [ ] Code is easy to understand
- [ ] Variable names are descriptive
- [ ] Functions are small and focused
- [ ] Comments explain WHY, not WHAT

### Architecture
- [ ] Changes follow existing patterns
- [ ] No unnecessary complexity
- [ ] Proper separation of concerns
- [ ] Dependencies are justified

### Performance
- [ ] No obvious performance issues
- [ ] Database queries are optimized
- [ ] No unnecessary re-renders
- [ ] Resource cleanup is proper

## Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation is present
- [ ] No SQL injection vulnerabilities
- [ ] Authentication/authorization checks

## Testing
- [ ] Tests cover new functionality
- [ ] Edge cases are tested
- [ ] Tests are maintainable
- [ ] All tests pass

## Documentation
- [ ] README updated if needed
- [ ] API documentation current
- [ ] Complex logic is documented`,
			categoryId: insertedCategories[1].id,
		},
		{
			slug: "run-tests-and-fix",
			title: "Run All Tests and Fix Failures",
			description: "Execute test suite and systematically fix any failures",
			content: `# Run All Tests and Fix Failures

## Overview
Run the complete test suite and fix any failing tests in a systematic way.

## Process

1. **Run the full test suite**
   \`\`\`bash
   npm test
   # or
   pnpm test
   \`\`\`

2. **Analyze failures**
   - Read error messages carefully
   - Identify patterns in failures
   - Group related failures

3. **Fix one at a time**
   - Start with the simplest failures
   - Run tests after each fix
   - Don't move to the next until current is green

4. **For each failure:**
   - Understand what the test expects
   - Check if the test needs updating
   - Fix the code or update the test
   - Verify the fix doesn't break other tests

5. **Final verification**
   - Run full suite again
   - Check coverage if applicable
   - Ensure no new failures introduced

## Common Issues
- Outdated snapshots: Update them carefully
- Race conditions: Add proper async handling
- Environment issues: Check test setup
- Flaky tests: Investigate and fix root cause`,
			categoryId: insertedCategories[2].id,
		},
		{
			slug: "security-audit",
			title: "Security Audit",
			description: "Perform a comprehensive security audit of the codebase",
			content: `# Security Audit

## Overview
Comprehensive security review of the codebase to identify and fix vulnerabilities.

## Areas to Check

### 1. Authentication & Authorization
- [ ] Password storage uses proper hashing
- [ ] Session management is secure
- [ ] Token expiration is implemented
- [ ] Role-based access control works correctly

### 2. Input Validation
- [ ] All user inputs are validated
- [ ] SQL injection prevention
- [ ] XSS protection in place
- [ ] CSRF tokens implemented

### 3. Data Protection
- [ ] Sensitive data is encrypted
- [ ] No secrets in code or logs
- [ ] Proper HTTPS configuration
- [ ] Secure cookie flags set

### 4. Dependencies
- [ ] Run \`npm audit\` or \`pnpm audit\`
- [ ] Review all dependency vulnerabilities
- [ ] Update vulnerable packages
- [ ] Check for known CVEs

### 5. API Security
- [ ] Rate limiting implemented
- [ ] Input sanitization present
- [ ] Error messages don't leak info
- [ ] CORS configured properly

### 6. File Operations
- [ ] File upload validation
- [ ] Path traversal prevention
- [ ] File size limits enforced
- [ ] Proper file permissions

## Tools to Use
- npm/pnpm audit for dependencies
- ESLint security plugins
- OWASP ZAP for web scanning
- Manual code review`,
			categoryId: insertedCategories[1].id,
		},
		{
			slug: "setup-new-feature",
			title: "Setup New Feature",
			description: "Scaffold and set up a new feature with proper structure",
			content: `# Setup New Feature

## Overview
Create a well-structured foundation for a new feature following project conventions.

## Steps

1. **Plan the feature**
   - Define the scope clearly
   - List all components needed
   - Identify dependencies
   - Create a simple architecture diagram

2. **Create the file structure**
   \`\`\`
   features/
     feature-name/
       components/
       hooks/
       utils/
       types.ts
       index.ts
   \`\`\`

3. **Set up types and interfaces**
   - Define TypeScript types first
   - Create clear interfaces
   - Document complex types

4. **Create base components**
   - Start with simple, focused components
   - Add prop types
   - Include basic tests

5. **Add routing (if needed)**
   - Create route definitions
   - Add navigation links
   - Set up route guards if needed

6. **Write initial tests**
   - Unit tests for utilities
   - Component tests for UI
   - Integration tests for flows

7. **Document the feature**
   - Add README in feature folder
   - Document props and APIs
   - Include usage examples

## Checklist
- [ ] File structure created
- [ ] Types defined
- [ ] Base components created
- [ ] Tests added
- [ ] Documentation written
- [ ] PR ready for review`,
			categoryId: insertedCategories[3].id,
		},
		{
			slug: "onboard-new-developer",
			title: "Onboard New Developer",
			description: "Comprehensive onboarding process for new team members",
			content: `# Onboard New Developer

## Overview
Comprehensive onboarding process to get a new developer up and running quickly.

## Steps

### 1. Environment Setup
- [ ] Install required tools (Node.js, Git, IDE)
- [ ] Clone the repository
- [ ] Install dependencies
- [ ] Set up environment variables
- [ ] Configure IDE extensions

### 2. Project Familiarization
- [ ] Review project README
- [ ] Understand the architecture
- [ ] Review coding conventions
- [ ] Explore the folder structure

### 3. Development Environment
- [ ] Create local database
- [ ] Run database migrations
- [ ] Seed test data
- [ ] Start development server
- [ ] Verify everything works

### 4. Make First Contribution
- [ ] Pick a good first issue
- [ ] Create a feature branch
- [ ] Make changes following guidelines
- [ ] Write/update tests
- [ ] Submit first PR

### 5. Access & Permissions
- [ ] Add to GitHub organization
- [ ] Grant necessary repository access
- [ ] Add to team communication channels
- [ ] Provide access to deployment tools
- [ ] Set up monitoring/logging access

### 6. Documentation Review
- [ ] API documentation
- [ ] Deployment process
- [ ] Testing guidelines
- [ ] Code review process

## Onboarding Checklist
- [ ] Development environment ready
- [ ] All tests passing locally
- [ ] Can run application locally
- [ ] Database set up and working
- [ ] Understands git workflow
- [ ] First PR submitted
- [ ] Has access to all necessary tools

## Resources
- Project wiki
- Team Slack/Discord
- Meeting schedule
- Key contacts`,
			categoryId: insertedCategories[4].id,
		},
		{
			slug: "address-pr-comments",
			title: "Address GitHub PR Comments",
			description: "Systematically address all review comments on a pull request",
			content: `# Address GitHub PR Comments

## Overview
Efficiently respond to and resolve all review comments on your pull request.

## Process

1. **Review all comments**
   - Read through all feedback carefully
   - Take notes on what needs to be changed
   - Ask for clarification if needed

2. **Categorize changes**
   - Quick fixes (typos, formatting)
   - Code changes (logic, refactoring)
   - Discussion needed (architectural decisions)

3. **Make the changes**
   - Start with quick fixes
   - Group related changes in commits
   - Test after each significant change

4. **Respond to comments**
   - Mark resolved items as resolved
   - Explain your changes if needed
   - Push back respectfully if you disagree
   - Thank reviewers for their feedback

5. **Update the PR**
   - Push your changes
   - Update the PR description if scope changed
   - Re-request review when ready

6. **Final check**
   - Ensure all comments are addressed
   - Run tests one more time
   - Verify CI passes

## Tips
- Don't take feedback personally
- Ask questions when unsure
- Batch similar changes together
- Keep commits atomic and meaningful
- Be responsive to reviewer feedback`,
			categoryId: insertedCategories[0].id,
		},
		{
			slug: "light-code-review",
			title: "Light Review of Existing Diffs",
			description: "Quick review of existing code changes for obvious issues",
			content: `# Light Review of Existing Diffs

## Overview
Quick pass through existing diffs to catch obvious issues before detailed review.

## Quick Checks

### 1. Obvious Issues (2 minutes)
- [ ] No commented-out code
- [ ] No console.log or debug statements
- [ ] No TODO comments without tickets
- [ ] Proper file formatting

### 2. Code Smell Check (3 minutes)
- [ ] No extremely long functions
- [ ] No deeply nested conditions
- [ ] No obvious code duplication
- [ ] Reasonable variable names

### 3. Common Mistakes (3 minutes)
- [ ] No hardcoded values that should be config
- [ ] Proper error handling present
- [ ] No unused imports or variables
- [ ] Type safety maintained

### 4. Documentation (2 minutes)
- [ ] Complex logic has comments
- [ ] Public APIs documented
- [ ] README updated if needed

## Red Flags
🚩 Large files (>500 lines) - needs splitting
🚩 Many files changed - might need breaking up
🚩 Mixed concerns - refactoring and features together
🚩 No tests - needs test coverage

## Result
- ✅ Looks good for detailed review
- ⚠️  Needs minor fixes before review
- ❌ Needs major rework`,
			categoryId: insertedCategories[1].id,
		},
	];

	console.log("Inserting commands...");
	const insertedCommands = await db
		.insert(commands)
		.values(commandsData)
		.returning();

	// Link commands to tags
	const tagMappings = [
		{ commandIndex: 0, tagIndex: 0 }, // Create PR -> Git
		{ commandIndex: 1, tagIndex: 1 }, // Code Review -> Review
		{ commandIndex: 2, tagIndex: 2 }, // Run Tests -> Testing
		{ commandIndex: 3, tagIndex: 3 }, // Security Audit -> Security
		{ commandIndex: 4, tagIndex: 4 }, // Setup Feature -> Setup
		{ commandIndex: 5, tagIndex: 6 }, // Onboard Developer -> Onboarding
		{ commandIndex: 6, tagIndex: 0 }, // Address PR -> Git
		{ commandIndex: 7, tagIndex: 1 }, // Light Review -> Review
	];

	console.log("Linking commands to tags...");
	await db.insert(commandTagMap).values(
		tagMappings.map((m) => ({
			commandId: insertedCommands[m.commandIndex].id,
			tagId: insertedTags[m.tagIndex].id,
		})),
	);

	console.log("✅ Seeding completed!");
	console.log(`Created ${insertedCategories.length} categories`);
	console.log(`Created ${insertedTags.length} tags`);
	console.log(`Created ${insertedCommands.length} commands`);
}

seed()
	.catch((error) => {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	})
	.then(() => {
		process.exit(0);
	});

