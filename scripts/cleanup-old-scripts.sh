#!/bin/bash
# Clean up all old fix scripts from root directory
# Run this after confirming everything works

cd /workspaces/Nexus-Community-Project

echo "🧹 Cleaning up old fix scripts from root directory..."
echo ""

# List scripts that will be removed
echo "Scripts to be removed:"
ls -1 *.sh 2>/dev/null | grep -E "^(push-|fix-|cleanup-|create-|deploy-|force-|rename-)" | head -20

echo ""
read -p "Delete these scripts? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    rm -f push-*.sh
    rm -f fix-*.sh  
    rm -f cleanup-*.sh
    rm -f create-*.sh
    rm -f deploy-prebuilt.sh
    rm -f force-main.sh
    rm -f rename-files.sh
    
    echo "✅ Old scripts removed!"
    echo ""
    echo "📁 Keep using: scripts/fix-all-components.sh"
else
    echo "❌ Cancelled. No files removed."
fi
