# Result Partners Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a polished, responsive placeholder partners section to the bottom of the result analysis page.

**Architecture:** Keep the feature self-contained as a `PartnersSection` subcomponent in the existing client-side result page. It uses the page's Framer Motion variants and Tailwind design tokens; partner metadata stays local because there is no partner API, image, or link in this release.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Framer Motion.

## Global Constraints

- Modify only `app/result/[id]/page.tsx` for the feature; introduce no dependencies, images, API routes, or external network requests.
- Insert the section after the team introduction and before `ContactSection`.
- Render exactly three non-clickable cards: `教育创新伙伴`、`学习成长伙伴`、`技术共创伙伴`.
- Desktop layout is three columns; narrow screens use a single column.
- Reuse `motion`, `fadeUp`, and `stagger`; verify with `npm run typecheck` and `npm run build`.

---

### Task 1: Add and verify the partners presentation component

**Files:**
- Modify: `app/result/[id]/page.tsx` (add `PartnersSection` and mount it)

**Interfaces:**
- Consumes: module-scoped `fadeUp` and `stagger` variants.
- Produces: `function PartnersSection(): JSX.Element` with no data or event dependencies.

- [ ] **Step 1: Write the failing rendered-content contract**

Record the expected content before production code: heading `合作伙伴`, title `与优秀伙伴，共赴成长`, three named cards, `grid-cols-1 md:grid-cols-3`, and no anchors or buttons in a partner card.

- [ ] **Step 2: Verify the contract is currently absent**

Run `Select-String -LiteralPath 'app\result\[id]\page.tsx' -Pattern 'function PartnersSection|教育创新伙伴|与优秀伙伴，共赴成长'`.

Expected: no output, because the component is not implemented.

- [ ] **Step 3: Write minimal production implementation**

Add a component with this local data:

```ts
const partners = [
  { name: "教育创新伙伴", label: "EDUCATION INNOVATION", icon: "spark" },
  { name: "学习成长伙伴", label: "LEARNING & GROWTH", icon: "orbit" },
  { name: "技术共创伙伴", label: "TECHNOLOGY CO-CREATION", icon: "grid" },
] as const;
```

Render a deep-indigo gradient panel with decorative radial light layers, text copy, and a `grid grid-cols-1 md:grid-cols-3 gap-4` of glass-style cards. Each card uses a decorative inline SVG with `aria-hidden="true"`, `fadeUp` entrance motion, and no click target. Mount `<PartnersSection />` immediately before `<ContactSection />`.

- [ ] **Step 4: Verify source contract and type safety**

Run `Select-String -LiteralPath 'app\result\[id]\page.tsx' -Pattern 'function PartnersSection|教育创新伙伴|学习成长伙伴|技术共创伙伴|与优秀伙伴，共赴成长|grid-cols-1 md:grid-cols-3'` and `npm run typecheck`.

Expected: every pattern matches; TypeScript exits with code 0.

- [ ] **Step 5: Build and inspect locally**

Run `npm run build`, then `npm run dev`. Open a real local `/result/<report-id>` page and confirm placement, three-to-one responsive layout, entrance animation, and absence of dead navigation.

- [ ] **Step 6: Commit narrowly scoped changes**

Run `git add -- 'app/result/[id]/page.tsx' 'docs/superpowers/plans/2026-07-21-result-partners-section.md'` then `git commit -m "feat: add result partners section"`.

Expected: only the feature and plan are committed; unrelated existing changes remain unstaged.

## Self-review

- Spec coverage: placement, visual language, three placeholders, responsive behavior, animation, no links, and local verification are covered by Task 1.
- Placeholder scan: no deferred implementation item or ambiguous requirement remains.
- Type consistency: `PartnersSection` has no props and references only module-scoped variants.
