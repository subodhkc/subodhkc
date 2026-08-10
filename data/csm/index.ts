/**
 * CSM data barrel — exports both V1 (historical) and V2 (current specification).
 *
 * V1 imports: import { csmDomains, csmProvenance, ... } from '@/data/csm'
 * V2 imports: import { CSM_SPEC_VERSION, governanceContracts, ... } from '@/data/csm/v2'
 *
 * V1 remains the original historical framework data.
 * V2 is the current deterministic-by-design specification.
 */

// V1 — original CSM publication data (historical, do not mutate)
export * from './v1'

// V2 — current specification (re-export for convenience)
export {
  CSM_SPEC_VERSION,
  CSM_SPEC_DATE,
  csmChangelog,
  csmDomains as csmV2Domains,
  csmComponents as csmV2Components,
  executionFunctions,
  operationalMapping,
  handoffContracts as csmV2HandoffContracts,
  reassessmentTriggers as csmV2ReassessmentTriggers,
  componentDependencies,
  csmV2Provenance,
  GOVERNANCE_DEPTH_DEFINITIONS,
  PROPORTIONALITY_FACTORS,
  REQUIREMENT_STATE_DEFINITIONS,
  DOMAIN_STATE_DEFINITIONS,
  SYSTEM_STATE_DEFINITIONS,
  DETERMINISTIC_DECISIONS,
  HUMAN_JUDGMENT_DECISIONS,
  FORBIDDEN_OUTPUT_STATES,
  FORBIDDEN_SCORE_NAMES,
} from './v2/spec'

export { governanceContracts, contractsByComponentId } from './v2/contracts'
export { evaluateCsmV2 } from './v2/evaluator'
export { fixtures } from './v2/fixtures'
export { invariants } from './v2/invariants'
export { nistIsoCrosswalk, crosswalkDisclaimer } from './v2/crosswalk'
