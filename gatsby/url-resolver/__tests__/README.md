# URL Resolver Tests

This directory contains test cases for the URL resolver module.

## Test Files

- **pattern-matcher.test.ts**: Tests for pattern matching functionality
  - Pattern matching with variables
  - Variable segments (0 or N segments)
  - Pattern application with aliases

- **branch-alias.test.ts**: Tests for alias functionality
  - Exact match aliases
  - Wildcard pattern aliases
  - Regex pattern aliases
  - Context-based alias selection

- **url-resolver.test.ts**: Tests for URL resolver main functionality
  - Source path parsing
  - URL calculation with different mapping rules
  - Conditional target patterns
  - Branch aliasing

## Running Tests

To run all tests:

```bash
yarn test
```

To run tests for a specific file:

```bash
yarn test pattern-matcher
yarn test branch-alias
yarn test url-resolver
```

## Test Coverage

The tests cover:

1. **Pattern Matching**
   - Simple variable matching
   - Variable segments (0 or more)
   - Complex patterns with multiple variables

2. **Pattern Application**
   - Variable substitution
   - Empty variable handling
   - Alias syntax with context

3. **Alias Resolution**
   - Exact matches
   - Wildcard patterns (`release-*` -> `v*`)
   - Regex patterns
   - Context-based filtering

4. **URL Resolution**
   - tidbcloud with prefix mapping
   - develop/best-practices/api/releases mapping
   - tidb with branch aliasing
   - Fallback rules
   - Conditional target patterns (for `_index` files)
