# Media Search Fix Instructions

## What was the issue?
The search wasn't finding files because:
1. The `filename` field wasn't being stored in the database for existing media files
2. Cloudinary's response structure needed proper extraction of the original filename

## What I've fixed?

### 1. Added `filename` field to Media Model
- New field to store the original uploaded filename

### 2. Updated Upload Component
- Now properly extracts the original filename from Cloudinary upload response
- Falls back to alternative fields if original_filename is not available
- Sends filename to database on new uploads

### 3. Updated Search API
- Searches across multiple fields: `filename`, `public_id`, `title`, `alt`
- Automatically strips file extensions (.jpg, .png, etc.) from search term
- Case-insensitive search
- Handles special characters properly

### 4. Created Migration Script
- Populates `filename` field for existing media records

## Steps to Fix Existing Media Files

1. **Run the migration script** to update existing media with filenames:
   ```
   POST http://localhost:3000/api/media/migrate-filename
   ```
   This will populate the `filename` field for all existing media records using their `public_id`

2. **Check what's in your database** (optional debug):
   ```
   GET http://localhost:3000/api/media/debug
   ```
   This shows the last 20 media files with their fields

## How to Search Now

Search for your files without worrying about:
- ❌ File extensions (.jpg, .png, etc.) - they're ignored
- ❌ Case sensitivity - it's all case-insensitive
- ❌ Special characters - they're handled properly

### Examples:
- Search: `Single Jersey Knitted Cotton Polo - Black` ✓
- Search: `cotton polo` ✓ (partial match)
- Search: `SINGLE JERSEY` ✓ (uppercase)
- Search: `Single Jersey Knitted Cotton Polo - Black.jpg` ✓ (with extension)

All will find the file!
