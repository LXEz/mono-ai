#!/bin/bash
npm version --workspaces --include-workspace-root $1 && npm install
