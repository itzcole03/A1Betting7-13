import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ComprehensiveAdminDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Style object for the comprehensive dashboard
  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --cyber-primary: #06ffa5;
      --cyber-secondary: #00ff88;
      --cyber-accent: #00d4ff;
      --cyber-purple: #7c3aed;
      --cyber-pink: #f72585;
      --cyber-orange: #ff6b35;
      --cyber-dark: #0f172a;
      --cyber-darker: #020617;
      --cyber-slate: #1e293b;
      --glass-bg: rgba(255, 255, 255, 0.02);
      --glass-border: rgba(255, 255, 255, 0.05);
      --quantum-blue: #4361ee;
      --neural-green: #43aa8b;
      --risk-red: #f72585;
    }

    .comprehensive-admin-root {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, var(--cyber-darker) 0%, var(--cyber-dark) 50%, #1e293b 100%);
      color: white;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .cyber-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 80%, rgba(6, 255, 165, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(0, 212, 255, 0.05) 0%, transparent 50%);
      z-index: -1;
    }

    .glass-card {
      backdrop-filter: blur(20px) saturate(180%);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .cyber-glow {
      box-shadow: 0 0 20px rgba(6, 255, 165, 0.3);
      transition: all 0.3s ease;
    }

    .cyber-glow:hover {
      box-shadow: 0 0 30px rgba(6, 255, 165, 0.5);
      transform: translateY(-2px);
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding: 20px;
    }

    .logo {
      font-size: 2.5rem;
      font-weight: bold;
      background: linear-gradient(45deg, var(--cyber-primary), var(--cyber-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 30px rgba(6, 255, 165, 0.5);
    }

    .grid {
      display: grid;
      gap: 20px;
      margin-bottom: 30px;
    }

    .grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    .grid-3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
    .grid-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }

    .metric-card {
      padding: 20px;
      text-align: center;
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--cyber-primary);
      margin-bottom: 5px;
    }

    .metric-label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }

    .metric-change {
      font-size: 0.8rem;
      margin-top: 5px;
    }

    .positive { color: var(--cyber-secondary); }
    .negative { color: #ff4757; }

    .opportunity-card {
      padding: 20px;
      margin-bottom: 15px;
      position: relative;
      overflow: hidden;
    }

    .opportunity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .opportunity-title {
      font-weight: bold;
      color: var(--cyber-primary);
    }

    .confidence-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .confidence-high {
      background: var(--cyber-secondary);
      color: var(--cyber-dark);
    }

    .confidence-medium {
      background: var(--cyber-accent);
      color: var(--cyber-dark);
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin: 10px 0;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--cyber-primary), var(--cyber-secondary));
      border-radius: 4px;
      transition: width 1s ease;
    }

    .cyber-button {
      padding: 12px 24px;
      background: linear-gradient(45deg, var(--cyber-primary), var(--cyber-secondary));
      color: var(--cyber-dark);
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cyber-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(6, 255, 165, 0.4);
    }

    .status-indicator {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }

    .status-online { background: var(--cyber-secondary); }
    .status-warning { background: #ffa502; }
    .status-offline { background: #ff4757; }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    .live-feed {
      max-height: 400px;
      overflow-y: auto;
      padding: 20px;
    }

    .feed-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .feed-time {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.8rem;
      margin-right: 15px;
      min-width: 60px;
    }

    .menu-toggle {
      position: fixed;
      top: 20px;
      left: 20px;
      width: 50px;
      height: 50px;
      background: linear-gradient(45deg, var(--cyber-primary), var(--cyber-accent));
      border: none;
      border-radius: 12px;
      cursor: pointer;
      z-index: 997;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      box-shadow: 0 4px 20px rgba(6, 255, 165, 0.3);
    }

    .menu-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(6, 255, 165, 0.5);
    }

    .toggle-line {
      width: 20px;
      height: 2px;
      background: var(--cyber-darker);
      border-radius: 1px;
      transition: all 0.3s ease;
    }

    .breadcrumb-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
    }

    .nav-actions {
      display: flex;
      gap: 10px;
    }

    .action-btn {
      padding: 8px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    .action-btn:hover {
      background: rgba(6, 255, 165, 0.1);
      color: var(--cyber-primary);
      transform: translateY(-2px);
    }

    .floating-action {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(45deg, var(--cyber-primary), var(--cyber-secondary));
      border: none;
      color: var(--cyber-dark);
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 8px 25px rgba(6, 255, 165, 0.4);
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .hidden { display: none; }

    .social-sentiment {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: rgba(67, 170, 139, 0.1);
      border-radius: 8px;
      margin: 5px 0;
    }

    .weather-impact {
      background: rgba(0, 212, 255, 0.1);
      border-left: 4px solid var(--cyber-accent);
      padding: 10px;
      margin: 5px 0;
    }

    .prediction-explanation {
      background: rgba(124, 58, 237, 0.1);
      border: 1px solid var(--cyber-purple);
      border-radius: 12px;
      padding: 15px;
      margin: 10px 0;
    }

    .ensemble-model-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 10px;
      padding: 15px;
    }

    .model-status-card {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      padding: 10px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .model-status-card:hover {
      border-color: var(--cyber-primary);
      box-shadow: 0 0 15px rgba(6, 255, 165, 0.3);
    }

    @media (max-width: 768px) {
      .container { padding: 10px; }
      .header { flex-direction: column; gap: 20px; }
      .logo { font-size: 2rem; }
      .grid-3, .grid-4 { grid-template-columns: 1fr; }
      .floating-action { bottom: 20px; right: 20px; }
    }
  `;

  const executeQuickBet = () => {
    console.log('Quick bet executed');
    alert('Best bet executed: Lakers O228.5 | $2,847 stake | Expected: +$1,361');
  };

  const runQuickArbitrage = () => {
    console.log('Quick arbitrage scan');
    alert('Quick arbitrage found: +5.8% ROI | Warriors spread discrepancy');
  };

  const scanAllBooks = () => {
    console.log('Scanning all books');
    alert('All books scanned: 47 edges found | Average ROI: +4.7%');
  };

  const optimizePortfolio = () => {
    console.log('Optimizing portfolio');
    alert('Portfolio optimized: +23.7% efficiency gain | Risk reduced by 15%');
  };

  const executeBet = (betId: string) => {
    console.log('Executing bet:', betId);
    alert(`Bet executed: ${betId} | Optimal stake placed successfully`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className='comprehensive-admin-root'>
        <div className='cyber-bg'></div>

        <div className='container'>
          {/* Header */}
          <div className='header glass-card'>
            <div className='logo'>A1BETTING</div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--cyber-primary)', fontWeight: 'bold' }}>$18,420.73</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                  Portfolio Value
                </div>
              </div>
              <div className='status-indicator status-online'></div>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>47 AI Models Active</span>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className='breadcrumb-nav'>
            <span id='currentLocation'>Dashboard</span>
            <div className='nav-actions'>
              <button className='action-btn' title='Refresh'>
                🔄
              </button>
              <button className='action-btn' title='Add to Favorites'>
                ⭐
              </button>
              <button className='action-btn' title='Fullscreen'>
                ⛶
              </button>
            </div>
          </div>

          {/* Enhanced Key Metrics */}
          <div className='grid grid-4'>
            <div className='glass-card metric-card cyber-glow'>
              <div className='metric-value'>72.4%</div>
              <div className='metric-label'>Win Rate</div>
              <div className='metric-change positive'>+2.3% this week</div>
            </div>
            <div className='glass-card metric-card cyber-glow'>
              <div className='metric-value'>$18,420</div>
              <div className='metric-label'>Total Profit</div>
              <div className='metric-change positive'>+$1,240 today</div>
            </div>
            <div className='glass-card metric-card cyber-glow'>
              <div className='metric-value'>91.5%</div>
              <div className='metric-label'>AI Accuracy</div>
              <div className='metric-change positive'>+0.8% improvement</div>
            </div>
            <div className='glass-card metric-card cyber-glow'>
              <div className='metric-value'>23</div>
              <div className='metric-label'>Live Opportunities</div>
              <div className='metric-change positive'>+7 new</div>
            </div>
          </div>

          {/* Advanced Dashboard Widgets */}
          <div className='grid grid-3' style={{ marginBottom: '30px' }}>
            <div className='glass-card'>
              <h4 style={{ padding: '15px', color: 'var(--cyber-primary)' }}>🔥 Hot Streaks</h4>
              <div style={{ padding: '0 15px 15px' }}>
                <div className='opportunity-card'>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>NBA Player Props</div>
                  <div style={{ margin: '5px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Win Streak</span>
                      <span style={{ color: 'var(--cyber-secondary)' }}>12 games</span>
                    </div>
                    <div className='progress-bar'>
                      <div className='progress-fill' style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div style={{ color: 'var(--cyber-secondary)', fontSize: '0.9rem' }}>
                    ROI: +247.8% this month
                  </div>
                </div>

                <div className='social-sentiment'>
                  <div>⚡</div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>NFL Spreads</div>
                    <div style={{ fontSize: '0.8rem' }}>8-game hot streak | +89.3% ROI</div>
                  </div>
                </div>

                <div className='weather-impact'>
                  <div style={{ fontWeight: 'bold' }}>Arbitrage Scanner</div>
                  <div>47 opportunities found today</div>
                  <div style={{ color: 'var(--cyber-secondary)' }}>Average ROI: +4.7%</div>
                </div>
              </div>
            </div>

            <div className='glass-card'>
              <h4 style={{ padding: '15px', color: 'var(--cyber-primary)' }}>
                📊 Performance Analytics
              </h4>
              <div style={{ padding: '0 15px 15px' }}>
                <div
                  style={{
                    height: '150px',
                    background:
                      'linear-gradient(45deg, rgba(6, 255, 165, 0.1), rgba(0, 212, 255, 0.1))',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      color: 'var(--cyber-secondary)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Daily ROI Trend
                  </div>
                  📈 Real-time Chart
                </div>

                <div className='ensemble-model-grid' style={{ marginTop: '15px' }}>
                  <div className='model-status-card'>
                    <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Today</div>
                    <div style={{ color: 'var(--cyber-secondary)', fontWeight: 'bold' }}>
                      +47.8%
                    </div>
                  </div>
                  <div className='model-status-card'>
                    <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>This Week</div>
                    <div style={{ color: 'var(--cyber-secondary)', fontWeight: 'bold' }}>
                      +184.2%
                    </div>
                  </div>
                  <div className='model-status-card'>
                    <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>This Month</div>
                    <div style={{ color: 'var(--cyber-secondary)', fontWeight: 'bold' }}>
                      +689.7%
                    </div>
                  </div>
                  <div className='model-status-card'>
                    <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>All Time</div>
                    <div style={{ color: 'var(--cyber-secondary)', fontWeight: 'bold' }}>
                      +2,847%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='glass-card'>
              <h4 style={{ padding: '15px', color: 'var(--cyber-primary)' }}>⚡ Quick Actions</h4>
              <div style={{ padding: '0 15px 15px' }}>
                <button
                  className='cyber-button'
                  style={{ width: '100%', marginBottom: '10px' }}
                  onClick={executeQuickBet}
                >
                  🎯 Execute Best Bet
                </button>
                <button
                  className='cyber-button'
                  style={{ width: '100%', marginBottom: '10px' }}
                  onClick={runQuickArbitrage}
                >
                  ⚡ Find Arbitrage
                </button>
                <button
                  className='cyber-button'
                  style={{ width: '100%', marginBottom: '10px' }}
                  onClick={scanAllBooks}
                >
                  🔍 Scan All Books
                </button>
                <button
                  className='cyber-button'
                  style={{ width: '100%', marginBottom: '10px' }}
                  onClick={optimizePortfolio}
                >
                  📊 Optimize Portfolio
                </button>

                <div className='prediction-explanation' style={{ marginTop: '15px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>AI Recommendations</div>
                  <div style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                    <div>💡 Increase NBA exposure by 15%</div>
                    <div>⚠️ Reduce same-game parlays</div>
                    <div>🎯 Focus on arbitrage opportunities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Opportunities Enhanced */}
          <div className='grid grid-2'>
            <div className='glass-card'>
              <h3 style={{ padding: '20px 20px 0', color: 'var(--cyber-primary)' }}>
                🎯 Elite Opportunities
              </h3>
              <div>
                <div className='opportunity-card cyber-glow'>
                  <div className='opportunity-header'>
                    <div className='opportunity-title'>Lakers vs Warriors O/U 228.5</div>
                    <div className='confidence-badge confidence-high'>96% Confidence</div>
                  </div>
                  <div>
                    Expected Value: <span style={{ color: 'var(--cyber-secondary)' }}>+12.3%</span>
                  </div>
                  <div
                    style={{
                      margin: '5px 0',
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Kelly: 18.4% | Sharpe: 3.42 | Model Consensus: 47/47
                  </div>
                  <div className='progress-bar'>
                    <div className='progress-fill' style={{ width: '96%' }}></div>
                  </div>
                  <button
                    className='cyber-button'
                    style={{ marginTop: '8px', fontSize: '0.8rem', padding: '6px 12px' }}
                    onClick={() => executeBet('lakers-warriors-total')}
                  >
                    Execute Bet
                  </button>
                </div>
                <div className='opportunity-card'>
                  <div className='opportunity-header'>
                    <div className='opportunity-title'>Chiefs -3.5 vs Bills</div>
                    <div className='confidence-badge confidence-high'>94% Confidence</div>
                  </div>
                  <div>
                    Expected Value: <span style={{ color: 'var(--cyber-secondary)' }}>+8.7%</span>
                  </div>
                  <div
                    style={{
                      margin: '5px 0',
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Kelly: 12.7% | Sharpe: 2.89 | Model Consensus: 44/47
                  </div>
                  <div className='progress-bar'>
                    <div className='progress-fill' style={{ width: '94%' }}></div>
                  </div>
                  <button
                    className='cyber-button'
                    style={{ marginTop: '8px', fontSize: '0.8rem', padding: '6px 12px' }}
                    onClick={() => executeBet('chiefs-bills-spread')}
                  >
                    Execute Bet
                  </button>
                </div>
                <div className='opportunity-card'>
                  <div className='opportunity-header'>
                    <div className='opportunity-title'>Dodgers ML +145</div>
                    <div className='confidence-badge confidence-medium'>87% Confidence</div>
                  </div>
                  <div>
                    Expected Value: <span style={{ color: 'var(--cyber-secondary)' }}>+6.2%</span>
                  </div>
                  <div
                    style={{
                      margin: '5px 0',
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Kelly: 8.9% | Sharpe: 2.14 | Model Consensus: 38/47
                  </div>
                  <div className='progress-bar'>
                    <div className='progress-fill' style={{ width: '87%' }}></div>
                  </div>
                  <button
                    className='cyber-button'
                    style={{ marginTop: '8px', fontSize: '0.8rem', padding: '6px 12px' }}
                    onClick={() => executeBet('dodgers-ml')}
                  >
                    Execute Bet
                  </button>
                </div>
              </div>
            </div>

            <div className='glass-card'>
              <h3 style={{ padding: '20px 20px 0', color: 'var(--cyber-primary)' }}>
                📡 Live Intelligence Feed
              </h3>
              <div className='live-feed'>
                <div className='feed-item'>
                  <div className='feed-time'>14:32</div>
                  <div>🎯 New arbitrage opportunity detected: +5.2% ROI</div>
                </div>
                <div className='feed-item'>
                  <div className='feed-time'>14:30</div>
                  <div>🤖 Neural Network #23 updated prediction confidence to 96%</div>
                </div>
                <div className='feed-item'>
                  <div className='feed-time'>14:28</div>
                  <div>💰 Bet placed successfully: $500 on Lakers O/U</div>
                </div>
                <div className='feed-item'>
                  <div className='feed-time'>14:25</div>
                  <div>📊 Model accuracy increased by 0.3% this hour</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button className='floating-action'>🤖</button>
      </div>
    </>
  );
};

export default ComprehensiveAdminDashboard;
