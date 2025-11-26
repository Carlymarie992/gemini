# GitHub Copilot Instructions for Gemini AI Assistant Repository

## Repository Purpose

This repository contains an AI assistant trained to understand and articulate complex patterns of domestic abuse, coercive control, DARVO, economic abuse, stalking, harassment, and legal abuse—particularly in family court and child custody contexts. The AI prioritizes safety, trauma-informed approaches, and pattern recognition to support protective parents, advocates, and legal professionals.

## Core Principles (CRITICAL - Always Apply)

### 1. **Safety First - Always**
- Children's safety must be prioritized over parental rights when abuse is present
- Protective measures and trauma-informed approaches are not bias—they are evidence-based practice
- The most dangerous time for victims is when leaving or after leaving
- Never minimize, dismiss, or create false equivalence between victim and abuser behaviors

### 2. **Pattern Recognition Over Incidents**
- Abuse is systematic, not situational—focus on patterns over time, not isolated incidents
- Look for multiple forms of abuse working together as a system of control
- Connect past relationship dynamics to current behavior

### 3. **Power and Control, Not Conflict**
- Distinguish between abuse (unidirectional, systematic, power imbalance) and conflict (bidirectional, episodic)
- Never frame abuse as "mutual conflict" or "high-conflict divorce"

### 4. **Trauma-Informed Understanding**
- Trauma affects victim presentation: emotional distress is normal, not evidence of instability
- The most articulate, calm party may be the abuser
- Credibility in court performance doesn't equal truthfulness

### 5. **Believe Patterns, Not Performances**
- Documentation and consistent patterns matter more than courtroom demeanor
- Consider who has power, who is at risk, what the history shows

## Knowledge Base Structure

The `/knowledge_base` directory contains comprehensive training materials:
- **economic_abuse.md** - Financial control as coercive control
- **stalking_harassment.md** - Surveillance and unwanted contact patterns
- **darvo.md** - Deny, Attack, Reverse Victim and Offender tactics
- **coercive_control.md** - Systematic domination and entrapment
- **legal_abuse_concealment.md** - Weaponizing courts and hiding abuse
- **communicating_to_judges.md** - Frameworks for articulating dynamics
- **example_scenarios.md** - Detailed scenarios with pattern analysis
- **quick_reference.md** - Quick lookup guide

The root **system_instructions.md** contains comprehensive AI training instructions.

## Coding and Contribution Standards

### Documentation Guidelines

1. **Maintain Trauma-Informed Language**
   - Use clear, accessible language
   - Avoid victim-blaming language
   - Center safety and wellbeing
   - Respect the gravity and sensitivity of the subject matter

2. **Evidence-Based Content**
   - Reference research and expert consensus
   - Cite sources (Evan Stark, Jennifer Freyd, Jane Monckton Smith, etc.)
   - Distinguish between established patterns and speculation

3. **Comprehensive and Practical**
   - Provide actionable frameworks
   - Include concrete examples
   - Offer specific language for communication
   - Consider multiple forms of abuse and intersectionality

4. **Cultural Competence and Inclusivity**
   - Recognize abuse dynamics apply across all genders, sexualities, cultures
   - Consider intersectionality (race, class, disability, immigration status)
   - Acknowledge marginalized people face additional barriers
   - Apply frameworks thoughtfully, not rigidly

### Content Changes

When modifying knowledge base documents:

1. **Preserve Core Principles**
   - Never dilute the safety-first, trauma-informed approach
   - Maintain focus on pattern recognition
   - Keep child safety as priority

2. **Enhance, Don't Contradict**
   - Add detail and clarity
   - Provide additional examples
   - Update with current research
   - DO NOT introduce contradictions to core principles

3. **Review for Sensitivity**
   - Ensure language is respectful to survivors
   - Avoid triggering or graphic descriptions where possible
   - Maintain professional, compassionate tone

### Code/Technical Changes (if applicable)

1. **Privacy and Security**
   - NO storage of personal information or case data
   - Ensure data privacy safeguards
   - Keep `.case-data` directory in `.gitignore`

2. **Testing**
   - Test thoroughly before committing
   - Ensure no breaking changes to existing functionality

3. **Documentation**
   - Keep README.md accurate and up-to-date
   - Update system_instructions.md if AI behavior changes
   - Document any new dependencies or setup requirements

## What NOT to Do

### NEVER:
- ❌ Minimize or dismiss abuse allegations
- ❌ Create false equivalence between victim and abuser
- ❌ Victim-blame or question why someone didn't leave sooner
- ❌ Prioritize neutrality over safety when abuse is present
- ❌ Remove or weaken trauma-informed language
- ❌ Dilute the safety-first approach
- ❌ Introduce content that contradicts research on abuse dynamics
- ❌ Include personal information, case details, or identifying information
- ❌ Provide specific legal advice (framework and education is OK)

### Quality Checks Before Committing:
- [ ] Does this maintain the safety-first principle?
- [ ] Is this trauma-informed and respectful to survivors?
- [ ] Does this align with research on abuse dynamics?
- [ ] Have I avoided victim-blaming language?
- [ ] Is the content evidence-based?
- [ ] Have I considered cultural competence and intersectionality?
- [ ] Does this protect privacy and confidentiality?

## Resources and Learning

### To Understand This Repository:
1. Start with [README.md](../README.md) for overview
2. Read [system_instructions.md](../system_instructions.md) for AI training principles
3. Review [knowledge_base/README.md](../knowledge_base/README.md) for complete guide
4. Study [example_scenarios.md](../knowledge_base/example_scenarios.md) to see patterns in action

### Key Concepts to Understand:
- **Coercive Control**: Systematic domination through isolation, regulation, degradation, and exploitation
- **DARVO**: Deny, Attack, and Reverse Victim and Offender
- **Economic Abuse**: Financial control used as weapon during and after relationships
- **Legal Abuse**: Weaponization of court system to continue control
- **Trauma-Informed Practice**: Understanding how trauma affects victim presentation

### Research Foundation:
- Evan Stark on coercive control
- Jennifer Freyd on DARVO
- Jane Monckton Smith on homicide timeline
- Validated risk assessment tools (MOSAIC, SARA, Danger Assessment)

## Support and Safety Information

If you need support while working on this sensitive material:
- **National Domestic Violence Hotline**: 1-800-799-7233 (SAFE)
- **National Child Abuse Hotline**: 1-800-422-4453 (4-A-CHILD)
- **National Sexual Assault Hotline**: 1-800-656-4673 (HOPE)

Working with content about abuse can be difficult. Take breaks as needed and seek support if affected by the material.

## License

MIT License - See [LICENSE](../LICENSE) file for details.

---

**Remember**: This repository exists to protect victims and children by helping people understand and articulate dangerous patterns of abuse. Every contribution should serve that mission while maintaining the highest standards of safety, sensitivity, and evidence-based practice.

**Safety first. Always.**
