<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Excel People Manager

This is a React TypeScript application built with Vite that provides Excel file import/export functionality for managing people data.

## Features

- Import Excel files with multiple sheets containing people data
- Search functionality to find people by name
- Add/remove people to/from a selection table
- Export selected people to Excel format

## Key Components

- `FileUpload`: Handles Excel file import using the xlsx library
- `SearchComponent`: Provides search functionality with real-time filtering
- `PeopleTable`: Displays selected people in a table format with export functionality
- `excelUtils`: Utility functions for reading and writing Excel files

## Technical Details

- Uses `xlsx` library for Excel file processing
- Uses `file-saver` for downloading exported files
- TypeScript interfaces for type safety
- Responsive design with CSS Grid/Flexbox
- Error handling for file operations

## Development Guidelines

- Use TypeScript type imports with `import type` for type-only imports
- Follow React functional component patterns with hooks
- Maintain proper error handling and user feedback
- Use semantic HTML and accessible design patterns
