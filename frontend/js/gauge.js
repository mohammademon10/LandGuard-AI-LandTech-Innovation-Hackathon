/**
 * LandGuard AI - Animated SVG Risk Gauge Component
 * Strictly adheres to design.md Section 4:
 * SVG semicircle, stroke animated via stroke-dashoffset, center score, respects prefers-reduced-motion.
 */

import { formatNumber, t, getCurrentLanguage } from './i18n.js';

export function renderRiskGauge(containerEl, score, level) {
  if (!containerEl) return;

  // Arc math: Radius 80, Semicircle perimeter = PI * 80 ~= 251.327
  const RADIUS = 80;
  const CIRCUMFERENCE = Math.PI * RADIUS;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const targetOffset = CIRCUMFERENCE * (1 - (normalizedScore / 100));

  // Determine color and level tokens
  let colorVar = '--risk-low';
  let badgeClass = 'risk-badge--low';
  let levelTextKey = 'risk_levels.LOW';
  let levelIcon = '🟢';

  if (level === 'HIGH' || normalizedScore >= 60) {
    colorVar = '--risk-high';
    badgeClass = 'risk-badge--high';
    levelTextKey = 'risk_levels.HIGH';
    levelIcon = '🔴';
  } else if (level === 'MEDIUM' || normalizedScore >= 30) {
    colorVar = '--risk-medium';
    badgeClass = 'risk-badge--medium';
    levelTextKey = 'risk_levels.MEDIUM';
    levelIcon = '🟡';
  }

  const levelText = t(levelTextKey);
  const formattedScore = formatNumber(normalizedScore);

  containerEl.innerHTML = `
    <div class="risk-gauge-container">
      <svg class="risk-gauge-svg" viewBox="0 0 200 115" role="img" aria-label="${t('result.risk_score_label')}: ${score}">
        <!-- Background Track -->
        <path class="risk-gauge-track" 
              d="M 20 100 A 80 80 0 0 1 180 100" />
        <!-- Dynamic Gauge Bar -->
        <path class="risk-gauge-bar" 
              id="gaugeBar"
              d="M 20 100 A 80 80 0 0 1 180 100" 
              stroke="var(${colorVar})"
              stroke-dasharray="${CIRCUMFERENCE}"
              stroke-dashoffset="${CIRCUMFERENCE}" />
      </svg>
      <div class="risk-gauge-value">
        <span class="risk-gauge-number" id="gaugeNumber" style="color: var(${colorVar})">${formattedScore}</span>
        <span class="risk-gauge-scale">${t('result.max_score')}</span>
      </div>
      <div class="risk-gauge-label">
        <span class="risk-badge ${badgeClass}">
          <span>${levelIcon}</span>
          <span>${levelText}</span>
        </span>
      </div>
    </div>
  `;

  const gaugeBar = containerEl.querySelector('#gaugeBar');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    gaugeBar.style.strokeDashoffset = targetOffset;
  } else {
    // Trigger CSS transition
    requestAnimationFrame(() => {
      setTimeout(() => {
        gaugeBar.style.strokeDashoffset = targetOffset;
      }, 50);
    });
  }
}
