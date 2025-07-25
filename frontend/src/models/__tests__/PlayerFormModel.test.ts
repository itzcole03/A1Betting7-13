﻿import { PlayerFormModel, getPlayerFormFeatures } from '@/PlayerFormModel';
import { UnifiedConfig } from '@/unified/UnifiedConfig.js';

describe('PlayerFormModel', () => {
  beforeEach(() => {
    UnifiedConfig.getInstance().set('enablePlayerFormModel', true);
  });

  it('predicts player form for NBA', async () => {
    expect(result.formScore).toBeGreaterThanOrEqual(0);
    expect(result.formScore).toBeLessThanOrEqual(1);
    expect(result.features).toHaveProperty('ppg_l5');
    expect(result.shapInsights.length).toBeGreaterThan(0);
  });

  it('predicts player form for MLB', async () => {
    expect(result.formScore).toBeGreaterThanOrEqual(0);
    expect(result.formScore).toBeLessThanOrEqual(1);
    expect(result.features).toHaveProperty('batting_avg_l7');
    expect(result.shapInsights.length).toBeGreaterThan(0);
  });

  it('throws if model is disabled by config', async () => {
    UnifiedConfig.getInstance().set('enablePlayerFormModel', false);
    await expect(
      getPlayerFormFeatures('nba-player-1', 'nba', {
        team: 'LAL',
        opponent: 'BOS',
        date: '2025-06-12',
      })
    ).rejects.toThrow('PlayerFormModel is disabled by config.');
  });

  it('returns consistent singleton instance', async () => {
    await getPlayerFormFeatures('nba-player-1', 'nba', {
      team: 'LAL',
      opponent: 'BOS',
      date: '2025-06-12',
    });

    expect(model1).toBe(model2);
  });
});
