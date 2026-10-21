# Synthetic recovery evidence evaluator

Run this offline example from the repository root with [Bun](https://bun.sh/):

```sh
bun examples/recovery-check.ts
```

No dependency installation is required. The command evaluates only the bundled
`recovery-check.json` fixture and prints JSON to the terminal. It has no network
requests, telemetry, environment-variable reads, output files, or visitor-data
collection. It does not accept external input files or fetch recovery evidence.
The fixture contains generic labels and simulated observations, with no people,
accounts, devices, hosts, addresses, or production records.

## Illustrative objectives and observations

These values demonstrate a policy decision. They are **not regulatory mandates**
or a recommendation for every service. Real recovery objectives depend on the
service's business impact and an agreed recovery acceptance point.
The RTO/RPO concepts follow [NIST SP 800-34 Rev. 1, section 3.2.1](https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final).
The 15- and 60-minute thresholds are choices for this example, not NIST requirements.

| Observation | Meaning | Illustrative decision |
| --- | --- | --- |
| `restoreDurationMinutes` | Simulated resource unavailability in minutes from the modeled disruption until usable recovery at its defined acceptance point, including any delay before restoration starts. This is not just the runtime of a restore command. | Must be at most the 15-minute recovery time objective (RTO). |
| `dataLossWindowMinutes` | Simulated minutes between the latest usable recovered data point and the modeled disruption. This is the modeled data-loss window, **not the age of a backup when this script runs**. | Must be at most the 60-minute recovery point objective (RPO). |
| `integrityVerified` | Whether a hypothetical, separately defined integrity check is reported as passing. The script does not perform that check. | Must be the boolean `true`. |

Both numeric boundaries are **inclusive**: exactly 15 minutes and exactly
60 minutes pass. Zero is a valid simulated observation. Missing values,
negative numbers, numeric strings, booleans in numeric fields, and non-finite
numbers are invalid. Integrity must be an explicit boolean; absent or differently
typed values remain unknown. A malformed record or unexpected evidence field also
prevents a pass. Inputs are never coerced into numbers or truthy booleans.

## Read the decision honestly

Every result has `synthetic: true`, an overall `status`, explanatory `reason`, and
individual completeness, recovery-time, data-loss-window, and integrity checks:

- `pass`: every required simulated observation is valid and meets the objectives.
- `fail`: at least one valid observation reports an objective breach or integrity
  failure. Other missing or invalid observations stay unknown in the check results.
- `unknown`: there is no demonstrated failure, but evidence is missing or invalid.

The bundled scenarios demonstrate a pass, excessive recovery duration, excessive
data loss, failed integrity, missing evidence, invalid numeric types, negative
duration, and a malformed record. Failure and unknown scenarios are expected
demonstration results, so the command completes normally after printing them.

This is a **policy/evidence evaluator using simulated records**. It never restores
a backup, verifies the provenance of evidence, measures an outage, tests application
functionality, or establishes that a production workload is recoverable. A reported
integrity flag is an input assertion, not an independently verified fact. A real
recovery exercise must define and perform its own checks before drawing any such
conclusion. Keep real operational or personal data out of this example.
