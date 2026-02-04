import { useEffect, useState } from 'react';
import './index.css';
import { QueryForm } from './components/QueryForm';
import { ResultCard } from './components/ResultCard';
import { checkQuota, type QuotaInfo } from './data/api';
import { ShieldCheck, SearchX } from 'lucide-react';
import { Clock4, Trash2 } from 'lucide-react';

function App() {
  const [result, setResult] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Array<{
    apiKey: string;
    label: string;
    timestamp: number;
  }>>([]);

  // Helpers
  const STORAGE_KEY = 'dq_quota_history';
  const maskKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}…${key.slice(-4)}`;
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        setHistory(JSON.parse(cached));
      }
    } catch {
      // ignore read errors (e.g., privacy mode)
    }
  }, []);

  const saveHistory = (apiKey: string) => {
    const entry = {
      apiKey,
      label: maskKey(apiKey),
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const deduped = [entry, ...prev.filter((h) => h.apiKey !== apiKey)].slice(0, 8);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
      } catch {
        /* ignore quota issues */
      }
      return deduped;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const handleSearch = async (apiKey: string) => {
    setLoading(true);
    setError('');

    try {
      const data = await checkQuota(apiKey);
      setResult(data);
      saveHistory(apiKey);
    } catch (err: any) {
      if (err.message === 'Invalid API Key') {
        setError('无效的 API Key，请检查后重试。');
      } else {
        setError('获取额度失败，请确保 Key 正确。');
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
  };

  return (
    <div className="container">
      {!result ? (
        <div className="animate-enter">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            {/* Logo Container - Simple Rounded Rect */}
            <div style={{
              width: '88px',
              height: '88px',
              margin: '0 auto 24px auto',
              borderRadius: '22px', // iOS continuous curve approximation
              overflow: 'hidden',
              backgroundColor: 'var(--ios-bg-tertiary)', // Neutral placeholder
              boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset'
            }}>
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.removeAttribute('style');
                }}
              />
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ios-gray)'
              }}>
                <ShieldCheck size={40} />
              </div>
            </div>

            <h1 style={{ fontSize: '34px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--ios-label-primary)' }}>
              德基 Quota
            </h1>
            <p style={{ color: 'var(--ios-gray)', fontSize: '17px', lineHeight: '22px' }}>
              立即查询您的德基额度和使用情况。
            </p>
          </div>

          <div className="ios-card">
            <QueryForm onSearch={handleSearch} isLoading={loading} />

            {error && (
              <div className="animate-enter" style={{
                marginTop: '16px',
                color: 'var(--ios-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '15px'
              }}>
                <SearchX size={18} />
                {error}
              </div>
            )}

            {history.length > 0 && (
              <div className="history-card">
                <div className="history-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock4 size={16} />
                    <span>最近查询</span>
                  </div>
                  <button className="ghost-btn" onClick={clearHistory}>
                    <Trash2 size={16} />
                    清空
                  </button>
                </div>
                <div className="history-list">
                  {history.map((h) => (
                    <button
                      key={h.apiKey}
                      className="history-pill"
                      onClick={() => handleSearch(h.apiKey)}
                      disabled={loading}
                    >
                      <span className="mono">{h.label}</span>
                      <span className="text-tertiary" style={{ fontSize: '12px' }}>{formatTime(h.timestamp)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <a
                href="https://item.taobao.com/item.htm?id=1000400880237&mi_id=0000uZ-n6MQ5LrfUY3gGGrUWV8I-QQbS0kVdcbRmgYygRRQ&spm=a21xtw.29178619.0.0&xxc=shop"
                target="_blank"
                rel="noopener noreferrer"
                className="promo-card"
              >
                <div className="promo-title">淘宝热卖 · 限时优惠</div>
                <div className="promo-subtitle">点我查看商品详情 →</div>
              </a>
            </div>
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.5, fontSize: '13px', color: 'var(--ios-label-tertiary)' }}>
            © 2026 Nano Services. All rights reserved.
          </div>
        </div>
      ) : (
        <ResultCard data={result} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
