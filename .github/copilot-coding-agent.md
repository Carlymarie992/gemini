# Copilot Coding Agent — Repository Instructions

Purpose
Provide explicit, repository-specific instructions for GitHub Copilot coding agents and other automated coding assistants working in this repository.

Core expectations
- Use the repository `manage_todo_list` workflow to plan and track multi-step changes.
- Make minimal, focused edits that preserve repo style and public APIs.
- Run existing tests and linters locally before proposing broader changes; surface failures when they cannot be fixed safely.
- Do not introduce secrets, credentials, or sensitive data into the repository. If work requires secrets, explain what needs to be set and where (CI secrets, local env vars), and do not add them to files.

Agent behavior and interaction
- Start every multi-step task by creating a concise todo list via the `manage_todo_list` tool and mark one task `in-progress` before editing files.
- Provide short preambles (1–2 sentences) before performing file edits or running significant tooling.
- After edits, run tests where possible and update the todo list to mark items completed. Provide concise progress updates when many changes occur.

Development rules and coding standards
- Keep changes surgical: prefer a small set of edits focused on the user request.
- Avoid reformatting unrelated files or large-scale refactors unless the user explicitly asks.
- Use clear, descriptive commit messages and PR descriptions. If opening a PR, include the todo list items and short rationale.

Testing and validation
- If tests exist in the repo, run the tests relevant to your changes and report results. If tests fail for unrelated reasons, note them and ask the human maintainer before attempting broad fixes.
- For new runnable code, include a minimal README and a short example showing how to run it locally.

Security and safety
- Never store or print secrets. Redact sensitive outputs from logs before adding them to commits or messages.
- If a change might affect data privacy, document the risk and required mitigations in the PR description.
- For any request that is harmful, illegal, or disallowed, respond with: "Sorry, I can't assist with that." and do not produce further content.

Pull requests and review
- Provide a short summary of what changed, why, and how to test it.
- Link to the todo list and relevant files in the PR body.
- Add automated test results or reproduction steps when applicable.

Examples (short templates)
- Todo list example:
  1. Add guidance file
  2. Update README with link
  3. Run tests and fix any failures related to change

- PR description template (short):
  - **Summary**: One sentence
  - **Files changed**: `file1`, `file2`
  - **How to test**: commands or steps
  - **Notes**: anything reviewers should know (backwards compatibility, migrations)

Contact and escalation
- If the agent is unsure about policy, tests, or sensitive changes, it should stop and ask a human reviewer.
- For urgent security concerns, open an issue and request immediate attention from repository maintainers.

Notes for maintainers
- This file documents the recommended workflow for Copilot coding agents and other automated tools. Maintainers may adapt or expand these instructions to fit organizational practices.
