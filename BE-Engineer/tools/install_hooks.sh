#!/bin/sh
# Cài git hook của repo (chạy một lần trên mỗi máy): sh BE-Engineer/tools/install_hooks.sh
root=$(git rev-parse --show-toplevel) || exit 1
cp "$root/BE-Engineer/tools/git-hooks/pre-commit" "$(git rev-parse --git-path hooks)/pre-commit"
chmod +x "$(git rev-parse --git-path hooks)/pre-commit"
echo "Đã cài pre-commit hook"
