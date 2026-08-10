/**
 * Generates csm-2.0.json from canonical TypeScript source.
 * Run: npx tsx scripts/generate-csm-v2-json.ts
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import {
  CSM_SPEC_VERSION,
  CSM_SPEC_DATE,
  csmChangelog,
  csmDomains,
  csmComponents,
  executionFunctions,
  operationalMapping,
  handoffContracts,
  reassessmentTriggers,
  componentDependencies,
  REQUIREMENT_STATE_DEFINITIONS,
  DOMAIN_STATE_DEFINITIONS,
  SYSTEM_STATE_DEFINITIONS,
  GOVERNANCE_DEPTH_DEFINITIONS,
  PROPORTIONALITY_FACTORS,
  csmV2Provenance,
  DETERMINISTIC_DECISIONS,
  HUMAN_JUDGMENT_DECISIONS,
  FORBIDDEN_OUTPUT_STATES,
  FORBIDDEN_SCORE_NAMES,
} from '../data/csm/v2/spec'
import { governanceContracts } from '../data/csm/v2/contracts'
import { nistIsoCrosswalk, crosswalkDisclaimer } from '../data/csm/v2/crosswalk'

const spec = {
  specVersion: CSM_SPEC_VERSION,
  specDate: CSM_SPEC_DATE,
  changelog: csmChangelog,
  domains: csmDomains,
  components: csmComponents,
  executionFunctions,
  governanceContracts,
  operationalMapping,
  handoffContracts,
  reassessmentTriggers,
  componentDependencies,
  stateModel: {
    requirementStates: REQUIREMENT_STATE_DEFINITIONS,
    domainStates: DOMAIN_STATE_DEFINITIONS,
    systemStates: SYSTEM_STATE_DEFINITIONS,
  },
  governanceDepth: {
    levels: GOVERNANCE_DEPTH_DEFINITIONS,
    proportionalityFactors: PROPORTIONALITY_FACTORS,
  },
  provenance: csmV2Provenance,
  determinismBoundary: {
    deterministicDecisions: [...DETERMINISTIC_DECISIONS],
    humanJudgmentDecisions: [...HUMAN_JUDGMENT_DECISIONS],
    forbiddenOutputStates: [...FORBIDDEN_OUTPUT_STATES],
    forbiddenScoreNames: [...FORBIDDEN_SCORE_NAMES],
  },
  nistIsoCrosswalk: {
    entries: nistIsoCrosswalk,
    disclaimer: crosswalkDisclaimer,
  },
}

const outputPath = join(process.cwd(), 'public/frameworks/csm/2.0/csm-2.0.json')
writeFileSync(outputPath, JSON.stringify(spec, null, 2), 'utf-8')
console.log(`Generated ${outputPath}`)
console.log(`Spec version: ${CSM_SPEC_VERSION}`)
console.log(`Domains: ${csmDomains.length}`)
console.log(`Components: ${csmComponents.length}`)
console.log(`Contracts: ${governanceContracts.length}`)
console.log(`Operational mappings: ${operationalMapping.length}`)
console.log(`Handoff contracts: ${handoffContracts.length}`)
console.log(`Reassessment triggers: ${reassessmentTriggers.length}`)
console.log(`Component dependencies: ${componentDependencies.length}`)
console.log(`NIST/ISO crosswalk entries: ${nistIsoCrosswalk.length}`)
