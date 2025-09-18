# Bundle Size Analyzer

A tool to analyze and track the individual import cost of Bits UI components. This measures the bundle size when importing each component in isolation, helping monitor the impact of changes on individual component sizes across PRs.

> **Important Note**: These measurements represent the cost of importing each component individually and include all their dependencies. In real applications where multiple components are used together, the actual total bundle size would be significantly smaller due to shared code and dependencies being deduplicated by bundlers.

## Features

- 📦 Analyzes individual component import costs (bundle size when imported in isolation)
- 🗜️ Provides both raw and gzipped sizes
- 📊 Generates detailed reports with timestamps
- 🔄 Compare bundle sizes between different builds
- 🎯 Filter analysis to specific components

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

Individual Component Import Costs:
----------------------------------
DropdownMenu        45.23 KB (13.67 KB gzipped)
Select              38.91 KB (11.74 KB gzipped)
Dialog              25.67 KB (7.70 KB gzipped)
Popover            18.45 KB (5.54 KB gzipped)
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
3. **Bundle Building**: Uses Vite to build each component in isolation (including all dependencies)
4. **Size Calculation**: Measures raw and gzipped bundle sizes for the isolated import
5. **Report Generation**: Creates JSON reports and formatted console output

This approach measures the "worst case" bundle cost - what you'd pay if you only imported that single component. In practice, when multiple components are used together, bundlers deduplicate shared code, resulting in much smaller total bundle sizes.
