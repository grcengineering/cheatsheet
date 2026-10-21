import { expect, test } from 'bun:test';
import { evaluateRecoveryEvidence } from '../examples/recovery-check';
import scenarios from '../examples/recovery-check.json';

const valid = { restoreDurationMinutes: 12, dataLossWindowMinutes: 35, integrityVerified: true };

test('a complete synthetic record meets all illustrative objectives without claiming a restore', () => {
  const result = evaluateRecoveryEvidence(valid);
  expect(result.status).toBe('pass');
  expect(result.synthetic).toBe(true);
  expect(result.checks.every(check => check.status === 'pass')).toBe(true);
  expect(result.reason).toContain('no actual recovery has been demonstrated');
});

test('zero and exact RTO/RPO boundaries pass; values beyond either limit fail', () => {
  for (const [restoreDurationMinutes, dataLossWindowMinutes] of [[0, 0], [15, 60]]) {
    expect(evaluateRecoveryEvidence({ restoreDurationMinutes, dataLossWindowMinutes, integrityVerified: true }).status).toBe('pass');
  }
  expect(evaluateRecoveryEvidence({ ...valid, restoreDurationMinutes: 15.01 }).status).toBe('fail');
  expect(evaluateRecoveryEvidence({ ...valid, dataLossWindowMinutes: 60.01 }).status).toBe('fail');
});

test('a reported integrity failure fails even when recovery time and data loss meet objectives', () => {
  const result = evaluateRecoveryEvidence({ ...valid, integrityVerified: false });
  expect(result.status).toBe('fail');
  expect(result.checks.find(check => check.check === 'integrity')?.status).toBe('fail');
  expect(result.checks.find(check => check.check === 'evidence-completeness')?.status).toBe('pass');
});

test('absent evidence cannot be interpreted as zero duration or a successful integrity check', () => {
  for (const field of Object.keys(valid)) {
    const incomplete: Record<string, unknown> = { ...valid };
    delete incomplete[field];
    const result = evaluateRecoveryEvidence(incomplete);
    expect(result.status).toBe('unknown');
    expect(result.checks.find(check => check.check === 'evidence-completeness')?.status).toBe('unknown');
  }
  expect(evaluateRecoveryEvidence({}).status).toBe('unknown');
});

test('numeric observations require actual finite non-negative numbers without coercion', () => {
  const invalid = [null, undefined, true, false, '12', -1, NaN, Infinity, -Infinity, {}, []];
  for (const field of ['restoreDurationMinutes', 'dataLossWindowMinutes']) {
    for (const value of invalid) {
      expect(evaluateRecoveryEvidence({ ...valid, [field]: value }).status).toBe('unknown');
    }
  }
});

test('integrity assertions require an explicit boolean rather than truthy values', () => {
  for (const integrityVerified of [null, undefined, 'true', 'false', 1, 0, {}, []]) {
    expect(evaluateRecoveryEvidence({ ...valid, integrityVerified }).status).toBe('unknown');
  }
});

test('malformed records and unexpected evidence fields cannot pass or leak into output', () => {
  for (const evidence of [null, undefined, true, 12, 'record', [], [valid], new Date(0), Object.create(valid)]) {
    expect(evaluateRecoveryEvidence(evidence).status).toBe('unknown');
  }
  const result = evaluateRecoveryEvidence({ ...valid, unexpected: 'not-retained' });
  expect(result.status).toBe('unknown');
  expect(JSON.stringify(result)).not.toContain('not-retained');
});

test('missing evidence cannot conceal an observed objective breach', () => {
  const result = evaluateRecoveryEvidence({ restoreDurationMinutes: 25 });
  expect(result.status).toBe('fail');
  expect(result.checks.find(check => check.check === 'recovery-time')?.status).toBe('fail');
  expect(result.checks.find(check => check.check === 'data-loss-window')?.status).toBe('unknown');
  expect(result.checks.find(check => check.check === 'evidence-completeness')?.status).toBe('unknown');
});

test('bundled scenarios demonstrate each documented decision', () => {
  const decisions = Object.fromEntries(scenarios.map(({ scenario, evidence }) => [scenario, evaluateRecoveryEvidence(evidence).status]));
  expect(decisions).toEqual({
    'complete-pass': 'pass',
    'slow-recovery': 'fail',
    'excess-data-loss': 'fail',
    'integrity-failure': 'fail',
    'missing-observation': 'unknown',
    'invalid-number-type': 'unknown',
    'invalid-negative-duration': 'unknown',
    'invalid-record-shape': 'unknown',
  });
});
