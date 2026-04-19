// Solver: Pre-commit Hooks + CI Gate (Guide)
export const id = 'q-precommit-ci-gate';
export const title = 'Pre-commit Hooks + CI Gate: ruff';

export async function solve(_email) {
  return {
    type: 'guide',
    variant: 'Setup ruff pre-commit + CI gate',
    answer: `Steps:
1. Create a PUBLIC GitHub repo, commit main.py

2. Add .pre-commit-config.yaml:
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.4
    hooks:
      - id: ruff
        args: [--fix, --exit-non-zero-on-fix]
      - id: ruff-format
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-merge-conflict

3. Add .github/workflows/ruff-ci.yml:
name: ruff-ci
on: [pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install ruff==0.4.4
      - run: ruff check . && ruff format --check .

4. Install locally: pip install pre-commit ruff==0.4.4 && pre-commit install
5. Create branch feature/add-analysis
6. Add analysis.py with violations → push → open PR → CI fails ❌
7. Fix violations → push → CI passes ✅
8. Submit: ruff 0.4.4|https://github.com/user/repo/actions/runs/PASSING_RUN_ID`,
    answerDisplay: 'Submit: ruff 0.4.4|<passing_workflow_run_url>'
  };
}
