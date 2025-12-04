#!/bin/bash
# Script to add branch creation instructions to all phase execution plans

echo "Adding branch creation step to all phase execution plans..."

# Function to add branch step at the beginning of each phase
add_branch_step() {
  local phase=$1
  local branch_name=$2
  local file="docs/PHASE_${phase}_EXECUTION_PLAN.md"
  
  # Create the branch step text
  local branch_text="
## **Before You Start: Create Feature Branch** ⭐

Before beginning Phase ${phase} work, create and switch to a dedicated feature branch:

\`\`\`bash
# Create and switch to feature branch (or switch if it exists)
git checkout -b ${branch_name} || git checkout ${branch_name}
\`\`\`

**Why?** Keep \`main\` stable,  isolate changes, enable easy rollback, follow professional Git workflow.

---
"
  
  # Find the line with "## 📝 Step-by Step" or similar and insert before it
  # This is a simplified approach - manual insertion recommended
  echo "Would add branch step to ${file} with branch name: ${branch_name}"
}

# Process each phase
add_branch_step 2 "feature/phase-2-layout"
add_branch_step 3 "feature/phase-3-content"
add_branch_step 4 "feature/phase-4-i18n"
add_branch_step 5 "feature/phase-5-api"
add_branch_step 6 "feature/phase-6-performance"
add_branch_step 7 "feature/phase-7-testing"

echo ""
echo "✅ Branch creation workflow added to PORTFOLIO_BUILD_GUIDE.md"
echo "✅ Branch creation step added to PHASE_1_EXECUTION_PLAN.md"
echo "📝 Manually add similar steps to phases 2-7 at their 'Before You Start' sections"
echo ""
echo "Template to use:"
echo "======================================================================"
cat << 'EOF'
## **Before You Start: Create Feature Branch** ⭐

Before beginning this phase, create and switch to a dedicated feature branch:

```bash
# Create and switch to feature branch (or switch if it exists)
git checkout -b feature/phase-X-name || git checkout feature/phase-X-name
```

**Why?** Keeps `main` stable, isolates changes, enables easy rollback, professional workflow.

---
EOF
echo "======================================================================"
