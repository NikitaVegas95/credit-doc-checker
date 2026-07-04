#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

cd "$ROOT_DIR"

echo "pre-commit: lint frontend"
npm --prefix frontend run lint

echo "pre-commit: stylelint css"
npm run stylelint

echo "pre-commit: run tests when configured"
npm --prefix frontend run test:all --if-present

echo "pre-commit: build frontend"
npm --prefix frontend run build

echo "pre-commit: build storybook"
npm --prefix frontend run build-storybook
