# Existing Blog Posts - Issues & Updates Needed

**Review Date:** November 2, 2025
**Reviewed By:** Claude Code
**Status:** Action Required

---

## Summary

Three blog posts require updates to ensure legal compliance and consistency with the cycle-syncing-guide.html standards.

**Posts Needing Updates:**
1. mood-tracking-benefits.html
2. habit-tracking-success.html
3. pregnancy-wellness-tips.html

---

## 1. Mood Tracking Benefits Post

**File:** `/blog/mood-tracking-benefits.html`
**Overall Status:** ⚠️ Needs Updates

### Issues Found

#### 🚨 HIGH PRIORITY

1. **Missing Medical Disclaimer**
   - **Issue:** Post discusses hormones, mental health, anxiety, depression - NO disclaimer present
   - **Risk:** Legal liability for mental health advice
   - **Action:** Add medical disclaimer at top of blog-content section
   - **Specific addition needed:** Include mental health crisis resources (988 Suicide & Crisis Lifeline)

2. **Unsubstantiated Research Claims**
   - **Line 157:** "Research shows that women experience more mood variability than men"
   - **Issue:** No citation provided
   - **Action:** Find source or soften to "Some research suggests"

   - **Line 157:** "Multiple studies have found that women's emotional states fluctuate more significantly"
   - **Issue:** "Multiple studies" but no references
   - **Action:** Cite specific studies or remove "multiple"

3. **Mental Health Guidance Without Qualifications**
   - **Lines 157-163:** Specific claims about hormones and neurotransmitters without sources
   - **Issue:** Could be seen as medical advice
   - **Action:** Add "research suggests" language + citations

#### ⚠️ MEDIUM PRIORITY

4. **Prescriptive Language**
   - **Various locations:** Uses "should," "will," "need to"
   - **Action:** Soften to "might consider," "may help," "you could try"

5. **When to Seek Professional Help Section**
   - **Lines 157-164:** Good that it's included, but needs strengthening
   - **Action:** Add more urgent language, include crisis hotline number
   - **Suggested addition:**
   ```html
   <div class="alert alert-danger">
       <h4><i class="bi bi-exclamation-triangle me-2"></i>When to Seek Immediate Help</h4>
       <p>If you're experiencing thoughts of self-harm or suicide, please:</p>
       <ul>
           <li>Call 988 (Suicide & Crisis Lifeline) immediately</li>
           <li>Text "HELLO" to 741741 (Crisis Text Line)</li>
           <li>Go to your nearest emergency room</li>
           <li>Call 911</li>
       </ul>
       <p class="mb-0">You are not alone, and help is available 24/7.</p>
   </div>
   ```

#### 📝 LOW PRIORITY

6. **Needs Sources Section**
   - **Action:** Add references section at bottom with citations for hormone claims
   - **Claims needing sources:**
     - Estrogen-serotonin connection
     - Progesterone-GABA receptor interaction
     - Stress hormone interactions

7. **Could Use More Specificity**
   - **Issue:** Fairly generic advice (track mood, notice patterns)
   - **Opportunity:** Add specific mood tracking scales (PHQ-9, GAD-7 mentions)
   - **Not urgent but would improve value**

---

## 2. Habit Tracking Success Post

**File:** `/blog/habit-tracking-success.html`
**Overall Status:** ⚠️ Needs Updates

### Issues Found

#### 🚨 HIGH PRIORITY

1. **Missing Medical Disclaimer**
   - **Issue:** Discusses behavior change, mentions hormones, gives specific strategies
   - **Action:** Add medical disclaimer (can be lighter than pregnancy post)

2. **Unsubstantiated Stat - CRITICAL**
   - **Line ~92:** "Research shows that women who sync their habits with their menstrual cycle are 40% more likely to maintain them long-term"
   - **Issue:** This is a SPECIFIC PERCENTAGE claim with NO source
   - **Risk:** High - could be seen as false advertising if unsupported
   - **Action Options:**
     1. Find the actual research (preferred)
     2. Remove the stat entirely
     3. Soften to "significantly more likely" without percentage
   - **Also appears in:** Meta description and other locations
   - **URGENT:** Address before any marketing campaigns reference this stat

3. **Research Claims Without Citations**
   - **Line ~108-123:** Claims about follicular/luteal phase hormones and behavior
   - **Issue:** Describes biological processes as fact without sources
   - **Action:** Add citations or soften language

#### ⚠️ MEDIUM PRIORITY

4. **21-Day Myth Section**
   - **Lines 188-198:** Mentions "18 to 254 days" and "average of 66 days"
   - **Issue:** Likely referencing Phillippa Lally's 2009 study, but not cited
   - **Action:** Add citation (easy to find this one)

5. **Maria's Story**
   - **Line ~251-261:** User testimonial
   - **Issue:** Need to verify this is a real person with permission OR clearly mark as composite/illustrative example
   - **Action:** Add footnote like "Maria is a composite character based on typical user experiences" OR get written permission

#### 📝 LOW PRIORITY

6. **Could Be More Actionable**
   - **Issue:** Great theory but could use more specific examples
   - **Opportunity:** Add sample habit stacking examples for different phases
   - **Not urgent but would improve conversion**

---

## 3. Pregnancy Wellness Tips Post

**File:** `/blog/pregnancy-wellness-tips.html`
**Overall Status:** 🚨 URGENT - Highest Risk

### Issues Found

#### 🚨 CRITICAL PRIORITY

1. **NO MEDICAL DISCLAIMER - PREGNANCY POST!**
   - **Issue:** Giving pregnancy advice with ZERO disclaimer
   - **Risk:** EXTREMELY HIGH - pregnancy is highest-risk area for health content
   - **Action:** ADD IMMEDIATELY
   - **Required additions:**
     - Standard medical disclaimer
     - "Always consult your OB-GYN"
     - "Every pregnancy is different"
     - "This is not a substitute for prenatal care"

2. **Specific Nutritional Dosages**
   - **Line 188:** "Folic acid intake (400-800 mcg daily)"
   - **Line 190:** "Protein consumption (75-100g daily)"
   - **Line 191:** "Hydration (8-12 cups of water daily)"
   - **Issue:** Giving specific medical/nutritional dosages WITHOUT "consult your doctor"
   - **Risk:** Very high - could be harmful if wrong for specific pregnancy
   - **Action:** Change to:
     - "Your healthcare provider will recommend appropriate folic acid dosage (commonly 400-800 mcg daily)"
     - "Protein needs vary - consult your OB-GYN for personalized recommendations"
     - "Stay well-hydrated - your doctor can advise on appropriate fluid intake"

3. **Prescriptive Pregnancy Advice**
   - **Line 196:** "Start prenatal vitamins early: Begin taking them before conception if possible"
   - **Issue:** This is medical advice about medication timing
   - **Action:** Change to "Ask your doctor about when to start prenatal vitamins, often recommended before conception"

4. **Specific Exercise Recommendations**
   - **Throughout:** Recommends specific exercises for pregnant women
   - **Issue:** Exercise during pregnancy requires medical clearance
   - **Action:** Add "with your doctor's approval" to ALL exercise mentions
   - **Add:** "Always consult your healthcare provider before starting or changing exercise during pregnancy"

5. **Research Claims Without Sources**
   - **Line 157:** "Research consistently shows that women who actively track their pregnancy health have better outcomes"
   - **Line 157:** "Multiple studies have found..."
   - **Issue:** Medical claims about pregnancy outcomes without citations
   - **Action:** Find sources or remove/soften

6. **Symptom Management Advice**
   - **Various:** Advice on managing morning sickness, fatigue, etc.
   - **Issue:** Could be misinterpreted as medical treatment recommendations
   - **Action:** Frame as "common strategies women use" not "you should do this"

#### ⚠️ MEDIUM PRIORITY

7. **Needs Sources Throughout**
   - **Multiple claims:** About trimester development, statistics, etc.
   - **Action:** Add comprehensive references section

8. **Missing Risk Warnings**
   - **Issue:** Should mention warning signs that need immediate medical attention
   - **Action:** Add callout box listing when to call doctor immediately:
     - Severe bleeding
     - Severe abdominal pain
     - No fetal movement (after 20 weeks)
     - Signs of preeclampsia
     - etc.

---

## Recommended Action Plan

### Phase 1: URGENT (Do ASAP)

1. **Pregnancy post disclaimer** (30 min)
   - Add medical disclaimer
   - Change dosage language to "consult your doctor"
   - Add exercise qualifications

2. **Habit post 40% stat** (15 min)
   - Remove or find source immediately
   - Update meta description if using the stat

3. **Mood post disclaimer** (20 min)
   - Add medical disclaimer
   - Add crisis resources

### Phase 2: HIGH PRIORITY (This Week)

4. **Find citations** (2-3 hours)
   - Hormone-behavior claims (all 3 posts)
   - Pregnancy outcome research
   - 21-day habit myth citation
   - Serotonin-estrogen connection

5. **Soften prescriptive language** (1-2 hours)
   - Replace "should" with "might consider"
   - Replace "will" with "may"
   - Add "research suggests" qualifiers
   - Add "consult your doctor" where needed

### Phase 3: MEDIUM PRIORITY (Next 2 Weeks)

6. **Add references sections** (2-3 hours)
   - Format all citations
   - Add numbered references
   - Link to sources

7. **Verify user testimonials** (30 min)
   - Get permissions or mark as composite
   - Add disclaimer if needed

8. **Enhance pregnancy warning section** (1 hour)
   - Add "when to call doctor" callout
   - Emergency signs
   - Crisis resources

### Phase 4: LOW PRIORITY (Ongoing)

9. **Enhance content depth** (ongoing)
   - Add more specific examples
   - Include downloadable resources
   - Add images and infographics

10. **Monitor and update** (quarterly)
    - Check for outdated information
    - Add new research
    - Update statistics

---

## Specific Text Changes Needed

### Pregnancy Post - Critical Changes

**BEFORE (Line 188-191):**
```html
<li>Folic acid intake (400-800 mcg daily)</li>
<li>Protein consumption (75-100g daily)</li>
<li>Hydration (8-12 cups of water daily)</li>
```

**AFTER:**
```html
<li>Folic acid: Consult your healthcare provider about appropriate supplementation (commonly 400-800 mcg daily is recommended)</li>
<li>Protein: Ask your doctor or registered dietitian about protein needs for your pregnancy</li>
<li>Hydration: Stay well-hydrated - your healthcare provider can advise on appropriate fluid intake</li>
```

**BEFORE (Line 196):**
```html
<li><strong>Start prenatal vitamins early:</strong> Begin taking them before conception if possible</li>
```

**AFTER:**
```html
<li><strong>Prenatal vitamins:</strong> Ask your healthcare provider about when to start prenatal vitamins - often recommended before conception when planning pregnancy</li>
```

### Habit Post - Critical Changes

**BEFORE (Line ~92):**
```html
<p>Research shows that women who sync their habits with their menstrual cycle are 40% more likely to maintain them long-term.</p>
```

**AFTER (Option 1 - with source):**
```html
<p>Research suggests that women who sync their habits with their menstrual cycle are more likely to maintain them long-term.<sup>[1]</sup></p>
<!-- Add proper citation if source found -->
```

**AFTER (Option 2 - without source):**
```html
<p>Many women find that aligning habits with their menstrual cycle makes them easier to maintain long-term.</p>
```

### Mood Post - Add This

**ADD AFTER OPENING PARAGRAPH:**
```html
<div class="alert alert-warning border-warning">
    <h4><i class="bi bi-info-circle me-2"></i>Medical Disclaimer</h4>
    <p class="mb-0"><strong>This article is for educational and informational purposes only and does not constitute medical advice.</strong> If you're experiencing symptoms of depression, anxiety, or other mental health concerns, please consult a licensed mental health professional. If you're having thoughts of self-harm or suicide, please call 988 (Suicide & Crisis Lifeline) or text "HELLO" to 741741 (Crisis Text Line) immediately. You are not alone, and help is available 24/7.</p>
</div>
```

---

## Files to Create/Update

### New Files Needed
- [ ] `/docs/PREGNANCY-BLOG-SOURCES.md` - Track sources needed for pregnancy post
- [ ] `/docs/HABIT-BLOG-SOURCES.md` - Track sources for habit post (especially that 40% stat!)
- [ ] `/docs/MOOD-BLOG-SOURCES.md` - Track sources for mood post

### Existing Files to Update
- [ ] `/blog/mood-tracking-benefits.html` - Add disclaimer, soften language
- [ ] `/blog/habit-tracking-success.html` - Fix 40% stat, add disclaimer
- [ ] `/blog/pregnancy-wellness-tips.html` - URGENT disclaimer and dosage changes

### Reference Documents
- [x] `/docs/BLOG-WRITING-GUIDE.md` - Created (use as template going forward)
- [x] `/docs/EXISTING-BLOGS-REVIEW.md` - This document

---

## Success Metrics

### Before Updates
- ❌ 0 of 3 posts have medical disclaimers
- ❌ Multiple unsourced medical claims
- ❌ Prescriptive language throughout
- ❌ Specific dosages without medical guidance
- ❌ Legal liability risk: HIGH

### After Updates (Goal)
- ✅ 3 of 3 posts have appropriate medical disclaimers
- ✅ All major claims sourced or softened
- ✅ Language is educational, not prescriptive
- ✅ Medical guidance defers to healthcare providers
- ✅ Legal liability risk: LOW

---

## Questions for Review

1. **Do we have a real "Maria" for the habit post testimonial?**
   - If yes: Get written permission
   - If no: Mark as composite example

2. **Where did the "40% more likely" stat come from?**
   - Internal research?
   - External study?
   - Marketing copy that needs verification?

3. **Are we comfortable giving pregnancy advice even with disclaimers?**
   - Consider consulting with legal
   - Might want OB-GYN review

4. **Priority order for fixes?**
   - Pregnancy post first (highest risk)
   - Then habit post (that 40% stat)
   - Then mood post

---

## Next Steps

1. **Review this document** with team
2. **Prioritize** which fixes to do first
3. **Assign tasks** if multiple people involved
4. **Set deadline** for critical fixes (suggest: within 48 hours for pregnancy post)
5. **Create source-finding tasks** in BLOG-CONTENT-TODO.md
6. **Update posts** following BLOG-WRITING-GUIDE.md
7. **Test changes** on mobile and desktop
8. **Resubmit to Google Search Console** after updates

---

**Document Status:** Complete - Ready for Action
**Last Updated:** November 2, 2025
**Next Review:** After fixes are implemented
