#!/bin/bash

# Add all files to git
git add .

# Commit with a message
git commit -m "Add package.json and build configuration for Netlify deployment"

# Push to the current branch
git push origin $(git rev-parse --abbrev-ref HEAD)

echo "✅ Files pushed to GitHub successfully!"
