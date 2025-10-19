import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

import { db } from '../db'
import { categories, type NewCategory } from '../db/schema/categories'
import {
  commandTagMap,
  commandTags,
  type NewCommandTag,
} from '../db/schema/command-tags'
import { commands, type NewCommand } from '../db/schema/commands'

async function seed() {
  console.log('🌱 Seeding database...')

  // Clear existing data (in order to respect foreign key constraints)
  console.log('Clearing existing data...')
  await db.delete(commandTagMap)
  await db.delete(commands)
  await db.delete(commandTags)
  await db.delete(categories)
  console.log('✓ Existing data cleared')

  // Seed Categories
  const categoryData: NewCategory[] = [
    {
      name: 'Development Workflow',
      slug: 'development-workflow',
      description: 'Commands for managing your development process',
    },
    {
      name: 'Code Quality',
      slug: 'code-quality',
      description: 'Commands for reviewing and improving code quality',
    },
    {
      name: 'Testing',
      slug: 'testing',
      description: 'Commands for testing and debugging',
    },
    {
      name: 'Project Setup',
      slug: 'project-setup',
      description: 'Commands for setting up new features and projects',
    },
    {
      name: 'Team Collaboration',
      slug: 'team-collaboration',
      description: 'Commands for onboarding and collaboration',
    },
  ]

  console.log('Inserting categories...')
  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning()

  // Seed Tags
  const tagData: NewCommandTag[] = [
    { name: 'Git', slug: 'git' },
    { name: 'Review', slug: 'review' },
    { name: 'Testing', slug: 'testing' },
    { name: 'Security', slug: 'security' },
    { name: 'Setup', slug: 'setup' },
    { name: 'Documentation', slug: 'documentation' },
    { name: 'Onboarding', slug: 'onboarding' },
  ]

  console.log('Inserting tags...')
  const insertedTags = await db.insert(commandTags).values(tagData).returning()

  // Seed Commands with Markdown content
  const commandsData: NewCommand[] = [
    {
      slug: 'create-pull-request',
      title: 'Create Pull Request',
      description: 'Create a comprehensive pull request with proper context',
      content: `# Create PR

## Overview
Create a well-structured pull request with proper description, labels, and reviewers.

## Steps
1. **Prepare branch**
   - Ensure all changes are committed
   - Push branch to remote
   - Verify branch is up to date with main

2. **Write PR description**
   - Summarize changes clearly
   - Include context and motivation
   - List any breaking changes
   - Add screenshots if UI changes

3. **Set up PR**
   - Create PR with descriptive title
   - Add appropriate labels
   - Assign reviewers
   - Link related issues

## PR Template
- [ ] Feature A
- [ ] Bug fix B
- [ ] Unit tests pass
- [ ] Manual testing completed`,
      categoryId: insertedCategories[0].id,
      status: 'approved',
    },
    {
      slug: 'code-review-checklist',
      title: 'Code Review Checklist',
      description: 'Comprehensive checklist for reviewing code changes',
      content: `# Code Review Checklist

## Overview
Comprehensive checklist for conducting thorough code reviews to ensure quality, security, and maintainability.

## Review Categories

### Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs or logic errors

### Code Quality
- [ ] Code is readable and well-structured
- [ ] Functions are small and focused
- [ ] Variable names are descriptive
- [ ] No code duplication
- [ ] Follows project conventions

### Security
- [ ] No obvious security vulnerabilities
- [ ] Input validation is present
- [ ] Sensitive data is handled properly
- [ ] No hardcoded secrets`,
      categoryId: insertedCategories[1].id,
      status: 'approved',
    },
    {
      slug: 'run-tests-and-fix',
      title: 'Run All Tests and Fix Failures',
      description: 'Execute test suite and systematically fix any failures',
      content: `# Run All Tests and Fix Failures

## Overview
Execute the full test suite and systematically fix any failures, ensuring code quality and functionality.

## Steps
1. **Run test suite**
   - Execute all tests in the project
   - Capture output and identify failures
   - Check both unit and integration tests

2. **Analyze failures**
   - Categorize by type: flaky, broken, new failures
   - Prioritize fixes based on impact
   - Check if failures are related to recent changes

3. **Fix issues systematically**
   - Start with the most critical failures
   - Fix one issue at a time
   - Re-run tests after each fix`,
      categoryId: insertedCategories[2].id,
      status: 'approved',
    },
    {
      slug: 'security-audit',
      title: 'Security Audit',
      description: 'Perform a comprehensive security audit of the codebase',
      content: `# Security Audit

## Overview
Comprehensive security review to identify and fix vulnerabilities in the codebase.

## Steps
1. **Dependency audit**
   - Check for known vulnerabilities
   - Update outdated packages
   - Review third-party dependencies

2. **Code security review**
   - Check for common vulnerabilities
   - Review authentication/authorization
   - Audit data handling practices

3. **Infrastructure security**
   - Review environment variables
   - Check access controls
   - Audit network security

## Security Checklist
- [ ] Dependencies updated and secure
- [ ] No hardcoded secrets
- [ ] Input validation implemented
- [ ] Authentication secure
- [ ] Authorization properly configured`,
      categoryId: insertedCategories[1].id,
      status: 'approved',
    },
    {
      slug: 'setup-new-feature',
      title: 'Setup New Feature',
      description: 'Scaffold and set up a new feature with proper structure',
      content: `# Setup New Feature

## Overview
Systematically set up a new feature from initial planning through to implementation structure.

## Steps
1. **Define requirements**
   - Clarify feature scope and goals
   - Identify user stories and acceptance criteria
   - Plan technical approach

2. **Create feature branch**
   - Branch from main/develop
   - Set up local development environment
   - Configure any new dependencies

3. **Plan architecture**
   - Design data models and APIs
   - Plan UI components and flow
   - Consider testing strategy

## Feature Setup Checklist
- [ ] Requirements documented
- [ ] User stories written
- [ ] Technical approach planned
- [ ] Feature branch created
- [ ] Development environment ready`,
      categoryId: insertedCategories[3].id,
      status: 'approved',
    },
    {
      slug: 'onboard-new-developer',
      title: 'Onboard New Developer',
      description: 'Comprehensive onboarding process for new team members',
      content: `# Onboard New Developer

## Overview
Comprehensive onboarding process to get a new developer up and running quickly.

## Steps
1. **Environment setup**
   - Install required tools
   - Set up development environment
   - Configure IDE and extensions
   - Set up git and SSH keys

2. **Project familiarization**
   - Review project structure
   - Understand architecture
   - Read key documentation
   - Set up local database

## Onboarding Checklist
- [ ] Development environment ready
- [ ] All tests passing
- [ ] Can run application locally
- [ ] Database set up and working
- [ ] First PR submitted`,
      categoryId: insertedCategories[4].id,
      status: 'approved',
    },
  ]

  console.log('Inserting commands...')
  const insertedCommands = await db
    .insert(commands)
    .values(commandsData)
    .returning()

  // Link commands to tags
  const tagMappings = [
    { commandIndex: 0, tagIndex: 0 }, // Create PR -> Git
    { commandIndex: 1, tagIndex: 1 }, // Code Review -> Review
    { commandIndex: 2, tagIndex: 2 }, // Run Tests -> Testing
    { commandIndex: 3, tagIndex: 3 }, // Security Audit -> Security
    { commandIndex: 4, tagIndex: 4 }, // Setup Feature -> Setup
    { commandIndex: 5, tagIndex: 6 }, // Onboard Developer -> Onboarding
  ]

  console.log('Linking commands to tags...')
  await db.insert(commandTagMap).values(
    tagMappings.map((m) => ({
      commandId: insertedCommands[m.commandIndex].id,
      tagId: insertedTags[m.tagIndex].id,
    })),
  )

  console.log('✅ Seeding completed!')
  console.log(`Created ${insertedCategories.length} categories`)
  console.log(`Created ${insertedTags.length} tags`)
  console.log(`Created ${insertedCommands.length} commands`)
}

seed()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
  .then(() => {
    process.exit(0)
  })
