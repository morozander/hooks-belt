#!/bin/bash

# Release script for hooks-belt
# Usage: ./scripts/release.sh [patch|minor|major]

set -e

# Check if version type is provided
if [ -z "$1" ]; then
    echo "Usage: $0 [patch|minor|major]"
    echo "Example: $0 patch"
    exit 1
fi

VERSION_TYPE=$1

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo "Error: Version type must be patch, minor, or major"
    exit 1
fi

echo "🚀 Preparing release for hooks-belt..."

# Run tests
echo "🧪 Running tests..."
npm test

# Build package
echo "🔨 Building package..."
npm run build

# Bump version
echo "📦 Bumping version ($VERSION_TYPE)..."
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✨ New version: $NEW_VERSION"

# Create git tag
echo "🏷️  Creating git tag v$NEW_VERSION..."
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION"
git tag "v$NEW_VERSION"

# Push changes and tag
echo "📤 Pushing changes and tag..."
git push origin main
git push origin "v$NEW_VERSION"

echo "🎉 Release v$NEW_VERSION prepared!"
echo "📋 Next steps:"
echo "   1. Check GitHub Actions workflow: https://github.com/morozander/hooks-belt/actions"
echo "   2. Verify the package was published to npm: https://www.npmjs.com/package/hooks-belt"
echo "   3. Create a GitHub release: https://github.com/morozander/hooks-belt/releases/new" 