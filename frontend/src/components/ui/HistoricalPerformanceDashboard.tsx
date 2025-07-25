﻿// HistoricalPerformanceDashboard.tsx;
// Visualizes user/model historical performance;

import { useBetHistoryStore } from '@/store/slices/betHistorySlice';
import React from 'react';
import { safeNumber } from '../../utils/UniversalUtils';

export const HistoricalPerformanceDashboard: React.FC = () => {
  // Get userHistory and modelHistory from the store
  const { userHistory, modelHistory } = useBetHistoryStore();
  return (
    <section className='w-full p-4 bg-white shadow rounded mb-4'>
      <h3 className='text-md font-bold mb-2'>Historical Performance</h3>
      {userHistory && userHistory.entries.length > 0 ? (
        <div>
          <h4 className='font-semibold mb-1'>Your Bet History</h4>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-xs border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='px-2 py-1'>Date</th>
                  <th className='px-2 py-1'>Bet ID</th>
                  <th className='px-2 py-1'>Type</th>
                  <th className='px-2 py-1'>Amount</th>
                  <th className='px-2 py-1'>Odds</th>
                  <th className='px-2 py-1'>Result</th>
                  <th className='px-2 py-1'>Profit</th>
                  <th className='px-2 py-1'>Confidence</th>
                  <th className='px-2 py-1'>Win Prob</th>
                </tr>
              </thead>
              <tbody>
                {userHistory.entries.map(entry => (
                  <tr key={entry.betId} className='border-b'>
                    <td className='px-2 py-1'>{entry.date}</td>
                    <td className='px-2 py-1'>{entry.betId}</td>
                    <td className='px-2 py-1'>{entry.betType}</td>
                    <td className='px-2 py-1'>${safeNumber(entry.amount, 2)}</td>
                    <td className='px-2 py-1'>{safeNumber(entry.odds, 2)}</td>
                    <td className='px-2 py-1'>{entry.result}</td>
                    <td className='px-2 py-1'>${safeNumber(entry.profit, 2)}</td>
                    <td className='px-2 py-1'>N/A</td>
                    <td className='px-2 py-1'>N/A</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className='text-gray-400'>No user bet history available.</div>
      )}
      {modelHistory && modelHistory.length > 0 && (
        <div className='mt-4'>
          <h4 className='font-semibold mb-1'>Model Performance</h4>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-xs border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='px-2 py-1'>Model</th>
                  <th className='px-2 py-1'>Market</th>
                  <th className='px-2 py-1'>Date</th>
                  <th className='px-2 py-1'>Prediction</th>
                  <th className='px-2 py-1'>Outcome</th>
                  <th className='px-2 py-1'>Correct?</th>
                  <th className='px-2 py-1'>Payout</th>
                  <th className='px-2 py-1'>Confidence</th>
                  <th className='px-2 py-1'>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {modelHistory.flatMap(mh =>
                  mh.entries.map((entry, idx) => (
                    <tr key={mh.model + mh.market + idx} className='border-b'>
                      <td className='px-2 py-1'>{mh.model}</td>
                      <td className='px-2 py-1'>{mh.market}</td>
                      <td className='px-2 py-1'>{entry.date}</td>
                      <td className='px-2 py-1'>{entry.prediction}</td>
                      <td className='px-2 py-1'>{entry.outcome}</td>
                      <td className='px-2 py-1'>{entry.outcome === 'Correct' ? 'Yes' : 'No'}</td>
                      <td className='px-2 py-1'>N/A</td>
                      <td className='px-2 py-1'>{safeNumber(entry.confidence, 2)}</td>
                      <td className='px-2 py-1'>{safeNumber(entry.accuracy * 100, 1)}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
