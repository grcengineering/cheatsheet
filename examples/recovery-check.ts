import scenarios from './recovery-check.json';

export const illustrativeObjectives = Object.freeze({ rtoMinutes: 15, rpoMinutes: 60 });

type Status = 'pass' | 'fail' | 'unknown';
type Check = {
  check: 'evidence-completeness' | 'recovery-time' | 'data-loss-window' | 'integrity';
  status: Status;
  reason: string;
};
export type RecoveryDecision = {
  synthetic: true;
  status: Status;
  reason: string;
  checks: Check[];
};

function numericCheck(value: unknown, limit: number, check: Check['check'], label: string): Check {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return { check, status: 'unknown', reason: `${label} requires a finite, non-negative number of minutes.` };
  }
  return {
    check,
    status: value <= limit ? 'pass' : 'fail',
    reason: `${label} is ${value} minutes; the illustrative maximum is ${limit} minutes (inclusive).`,
  };
}

/** Evaluates simulated observations only; performs no restore or evidence verification. */
export function evaluateRecoveryEvidence(evidence: unknown): RecoveryDecision {
  const plainObject = evidence !== null && typeof evidence === 'object'
    && (Object.getPrototypeOf(evidence) === Object.prototype || Object.getPrototypeOf(evidence) === null);
  const record = plainObject
    ? evidence as Record<string, unknown>
    : null;
  const expectedFields = ['restoreDurationMinutes', 'dataLossWindowMinutes', 'integrityVerified'];
  const unexpectedFields = record !== null && Object.keys(record).some(key => !expectedFields.includes(key));
  const observedChecks: Check[] = [
    numericCheck(record?.restoreDurationMinutes, illustrativeObjectives.rtoMinutes, 'recovery-time', 'Modeled resource unavailability'),
    numericCheck(record?.dataLossWindowMinutes, illustrativeObjectives.rpoMinutes, 'data-loss-window', 'Data-loss window'),
    {
      check: 'integrity',
      status: typeof record?.integrityVerified === 'boolean'
        ? record.integrityVerified ? 'pass' : 'fail'
        : 'unknown',
      reason: typeof record?.integrityVerified === 'boolean'
        ? record.integrityVerified
          ? 'The simulated observation reports that its defined integrity check passed.'
          : 'The simulated observation reports that its defined integrity check failed.'
        : 'Integrity requires an explicit boolean observation.',
    },
  ];
  const complete = record !== null && expectedFields.every(field => Object.hasOwn(record, field))
    && !unexpectedFields && observedChecks.every(check => check.status !== 'unknown');
  const status: Status = observedChecks.some(check => check.status === 'fail') ? 'fail' : complete ? 'pass' : 'unknown';
  return {
    synthetic: true,
    status,
    reason: status === 'fail'
      ? 'At least one simulated observation fails the illustrative objectives; any remaining unknowns still require evidence.'
      : status === 'pass'
        ? 'Complete simulated observations satisfy the illustrative objectives; no actual recovery has been demonstrated.'
        : 'The simulated evidence is incomplete or invalid; whether the illustrative objectives are met is unknown.',
    checks: [
      {
        check: 'evidence-completeness',
        status: complete ? 'pass' : 'unknown',
        reason: complete
          ? 'All three required observations have valid types and ranges, with no unexpected fields.'
          : 'Expected an object containing only valid restoreDurationMinutes, dataLossWindowMinutes, and integrityVerified observations.',
      },
      ...observedChecks,
    ],
  };
}

if (import.meta.main) {
  console.log(JSON.stringify({
    synthetic: true,
    illustrativeObjectives,
    notice: 'Offline policy/evidence evaluation of bundled simulated records. No backup restore is performed.',
    scenarios: scenarios.map(({ scenario, service, evidence }) => ({
      scenario,
      service,
      ...evaluateRecoveryEvidence(evidence),
    })),
  }, null, 2));
}
