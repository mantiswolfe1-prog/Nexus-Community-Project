#!/bin/bash

# Nexus Workspace Organization Script
echo "🗂️  Organizing Nexus workspace..."

# Create organized directories
mkdir -p docs
mkdir -p html-demos
mkdir -p scripts/archived

# Move documentation files
echo "📚 Moving documentation files..."
for file in *.md; do
    if [ -f "$file" ] && [ "$file" != "README.md" ]; then
        mv "$file" docs/
        echo "  ✓ Moved $file to docs/"
    fi
done

# Move HTML demo files and txt files
echo "🌐 Moving HTML demos and text files..."
for file in *.html *.txt; do
    if [ -f "$file" ]; then
        mv "$file" html-demos/
        echo "  ✓ Moved $file to html-demos/"
    fi
done

# Move shell scripts
echo "⚙️  Moving shell scripts..."
for file in *.sh; do
    if [ -f "$file" ] && [ "$file" != "organize-workspace.sh" ]; then
        mv "$file" scripts/
        echo "  ✓ Moved $file to scripts/"
    fi
done

# Move zip archives
echo "📦 Moving archives..."
for file in *.zip; do
    if [ -f "$file" ]; then
        mv "$file" scripts/archived/
        echo "  ✓ Moved $file to scripts/archived/"
    fi
done

# Clean up redundant gitignore
if [ -f ".gitignore-new" ]; then
    rm .gitignore-new
    echo "  ✓ Removed .gitignore-new"
fi

# Remove duplicate UserNotRegisteredError file (keep .js version)
if [ -f "src/Components/UserNotRegisteredError" ]; then
    rm "src/Components/UserNotRegisteredError"
    echo "  ✓ Removed duplicate UserNotRegisteredError (kept .js version)"
fi

echo ""
echo "✨ Workspace organization complete!"
echo ""
echo "📁 New structure:"
echo "  docs/           - All documentation (.md files)"
echo "  html-demos/     - HTML demos and launcher files"
echo "  scripts/        - Shell scripts"
echo "  scripts/archived/ - Old zip archives"
echo "  src/            - Source code (unchanged)"
echo "  build/          - Production build"
echo "  public/         - Static assets"
echo ""
