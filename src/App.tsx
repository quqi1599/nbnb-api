import { useState } from 'react';
import './index.css';
import { QueryForm } from './components/QueryForm';
import { ResultCard } from './components/ResultCard';
import { checkQuota, type QuotaInfo } from './data/api';
import { ShieldCheck, SearchX } from 'lucide-react';

function App() {
  const [result, setResult] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (apiKey: string) => {
    setLoading(true);
    setError('');

    try {
      const data = await checkQuota(apiKey);
      setResult(data);
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

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a
                href="https://item.taobao.com/item.htm?id=1000400880237&mi_id=0000uZ-n6MQ5LrfUY3gGGrUWV8I-QQbS0kVdcbRmgYygRRQ&spm=a21xtw.29178619.0.0&xxc=shop"
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
                style={{ display: 'inline-block' }}
              >
                逛逛我们的淘宝商品 →
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
