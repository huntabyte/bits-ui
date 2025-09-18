# Bundle Size Analyzer

A tool to analyze and track bundle sizes of Bits UI components. This helps monitor the impact of changes on bundle size across PRs.

## Features

- 📦 Analyzes individual component bundle sizes
- 🗜️ Provides both raw and gzipped sizes
- 📊 Generates detailed reports with timestamps
- 🔄 Compare bundle sizes between different builds
- 🎯 Filter analysis to specific components
- 📈 Perfect for CI/CD integration

## Usage

### Analyze All Components

```bash
pnpm bundle:analyze
```

### Analyze Specific Components

```bash
pnpm bundle:analyze Select Dialog Popover
```

### Compare Two Reports

```bash
pnpm bundle:compare bundle-reports/current.json bundle-reports/previous.json
```

## Output

The analyzer generates:

1. **Console Output**: Formatted table showing component sizes
2. **JSON Reports**: Saved to `bundle-reports/` directory
3. **Latest Report**: Always saved as `bundle-reports/latest.json`

### Sample Output

```
📊 Bundle Size Report
=====================
Generated: 9/18/2025, 2:30:45 PM

Component Sizes:
----------------
DropdownMenu        45.23 KB (13.67 KB gzipped)
Select              38.91 KB (11.74 KB gzipped)
Dialog              25.67 KB (7.70 KB gzipped)
Popover            18.45 KB (5.54 KB gzipped)

Total Bundle Size:
------------------
Raw:     128.26 KB
Gzipped: 38.65 KB
```

### Comparison Output

```
📈 Bundle Size Comparison
=========================

📈 Select: +2.34 KB (+6.4%)
📉 Dialog: -1.12 KB (-4.2%)
➡️ Popover: +0.05 KB (+0.3%)

Total Change:
-------------
📈 +1.27 KB (+1.0%)
```

## How It Works

1. **Component Detection**: Automatically extracts all exports from each component
2. **Test Generation**: Creates test files that import all component parts
3. **Bundle Building**: Uses Vite to build each component in isolation
4. **Size Calculation**: Measures raw and gzipped bundle sizes
5. **Report Generation**: Creates JSON reports and formatted console output

## CI Integration

### GitHub Actions Example

```yaml
name: Bundle Size Check

on:
  pull_request:
    branches: [main]

jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install
      - run: pnpm build:packages

      # Generate current bundle report
      - run: pnpm bundle:analyze

      # Checkout main branch to compare
      - run: git fetch origin main
      - run: git checkout origin/main
      - run: pnpm install
      - run: pnpm build:packages
      - run: pnpm bundle:analyze
      - run: mv bundle-reports/latest.json bundle-reports/main.json

      # Switch back and compare
      - run: git checkout -
      - run: pnpm install
      - run: pnpm build:packages
      - run: pnpm bundle:analyze
      - run: pnpm bundle:compare bundle-reports/latest.json bundle-reports/main.json
```

## Component Coverage

Currently analyzes these components:

- Select
- Dialog
- Popover
- Accordion
- Tabs
- DropdownMenu
- ContextMenu
- AlertDialog
- Tooltip
- Checkbox

## Configuration

The component definitions are in `bundle-analyzer.ts`. To add new components:

1. Add to the `COMPONENTS` array with the correct exports
2. Or run `tsx scripts/extract-components.ts` to auto-generate

## Files

- `bundle-analyzer.ts` - Main analyzer script
- `extract-components.ts` - Helper to extract component definitions
- `bundle-reports/` - Generated reports directory
