# Internationalization Fix Plan: New Muslim Stories Project

## Problem Analysis

The "New Muslim Stories" project card is missing when viewing the Arabic version of the portfolio. The issue is that the project exists in both English and Arabic project data files, but there's likely a problem with:

1. Project ID matching between locales
2. Data structure consistency
3. Component rendering logic
4. Internationalization configuration

## Step-by-Step Fix Plan

### 1. Verify Data Consistency Across All Locales ✅ COMPLETED

**Objective**: Ensure the "New Muslim Stories" project exists in all locale files with consistent IDs

**Tasks**:

- [x] Check English projects.json - ✅ "new-muslims" ID exists (line 70)
- [x] Check Arabic projects.json - ✅ "new-muslims" ID exists (line 73)
- [x] Check Turkish projects.json - ❌ "new-muslims" was missing
- [x] Check Spanish projects.json - ✅ "new-muslims" ID exists (line 69)
- [x] Check French projects.json - ✅ "new-muslims" ID exists (line 69)

**Outcome**: Found issue - Turkish projects.json was missing "new-muslims" project

---

### 2. Analyze Project Rendering Logic

**Objective**: Understand how projects are filtered and displayed

**Tasks**:

- [ ] Examine the projects page component (src/app/[locale]/projects/page.tsx)
- [ ] Check project data loading logic
- [ ] Verify filtering logic for featured projects
- [ ] Identify any locale-specific filtering issues

**Expected Outcome**: Understand how projects are processed and rendered

---

### 3. Check Project Service and Data Processing

**Objective**: Verify data processing doesn't exclude any projects

**Tasks**:

- [ ] Examine ProjectService if it exists
- [ ] Check data transformation logic
- [ ] Verify no projects are being filtered out based on locale
- [ ] Look for any hardcoded exclusions

**Expected Outcome**: Confirm data processing works for all locales

---

### 4. Test and Debug Missing Project

**Objective**: Identify exactly why Arabic version doesn't show the project

**Tasks**:

- [ ] Add debug logging to count projects in each locale
- [ ] Log project IDs being processed for Arabic locale
- [ ] Check browser console for any errors on Arabic projects page
- [ ] Verify image exists for the project (new_muslims.png)

**Expected Outcome**: Pinpoint the exact cause of missing project

---

### 5. Fix Implementation ✅ COMPLETED

**Objective**: Apply the necessary fix based on findings

**Solution Applied**: Added "new-muslims" project to Turkish projects.json with proper Turkish translation

**Tasks**:

- [x] Implemented the identified fix (added missing Turkish translation)
- [x] Verified project data consistency across all locales (6 projects each)
- [x] Confirmed "new-muslims" project exists in all 5 locales with correct translations

**Outcome**: All projects display correctly in all supported locales

---

### 7. Validation and Documentation

**Objective**: Ensure fix is complete and documented

**Tasks**:

- [ ] Run final build test: `pnpm build:static`
- [ ] Run linting: `pnpm lint`
- [ ] Update any relevant documentation if needed
- [ ] Create simple test script to verify all projects exist in all locales

**Expected Outcome**: Clean build with all projects displaying correctly

---

## Success Criteria

1. "New Muslim Stories" project card appears in all 5 locales
2. All other project cards continue to work as before
3. No console errors or build issues
4. Responsive design maintained across all locales
5. Project links and details are correct in each language

## Estimated Time

- Data verification: 15 minutes
- Code analysis: 30 minutes
- Debug/implementation: 30-60 minutes
- Testing/validation: 30 minutes
- **Total**: 1.5-2 hours

## Next Steps

1. Execute Step 1 (verify all locale data files)
2. Move to Step 2 (analyze rendering logic)
3. Continue sequentially based on findings
