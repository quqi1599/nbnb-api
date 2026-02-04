import React from 'react';
import type { QuotaInfo } from '../data/api';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ResultCardProps {
    data: QuotaInfo;
    onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
    const percentage = data.total > 0
        ? Math.min(100, Math.max(0, (data.used / data.total) * 100))
        : 100;

    // Apple Colors
    const getProgressColor = () => {
        if (percentage > 90) return 'var(--ios-red)';
        if (percentage > 70) return 'var(--ios-orange)';
        return 'var(--ios-green)';
    };

    const isExhausted = data.remaining <= 0;

    return (
        <div className="ios-card animate-enter" style={{ textAlign: 'center', position: 'relative' }}>
            {/* Close Button */}
            <button
                onClick={onReset}
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--ios-label-secondary)',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
                <X size={18} />
            </button>

            <div style={{ marginBottom: '20px' }}>
                {!isExhausted ? (
                    <CheckCircle2 size={56} color="var(--ios-green)" style={{ margin: '0 auto' }} />
                ) : (
                    <AlertCircle size={56} color="var(--ios-red)" style={{ margin: '0 auto' }} />
                )}
            </div>

            <h2 style={{ fontSize: '22px', marginBottom: '8px', color: 'var(--ios-label-primary)' }}>
                {isExhausted ? '额度已用尽' : '正常'}
            </h2>

            {/* List style group */}
            <div style={{ backgroundColor: 'var(--ios-bg-tertiary)', borderRadius: '12px', marginTop: '24px' }}>

                {/* Row 1: Usage Bar */}
                <div style={{ padding: '16px', borderBottom: '0.5px solid var(--ios-separator)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '15px' }}>
                        <span className="text-secondary">使用率</span>
                        <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#48484a', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percentage}%`, background: getProgressColor(), borderRadius: '3px', transition: 'width 1s ease-out' }}></div>
                    </div>
                </div>

                {/* Row 2: Used / Limit */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <div style={{ padding: '16px', borderRight: '0.5px solid var(--ios-separator)' }}>
                        <div style={{ fontSize: '13px', marginBottom: '6px', color: 'var(--ios-orange)', fontWeight: 500 }}>已用</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ios-label-primary)' }}>${data.used.toFixed(2)}</div>
                    </div>
                    <div style={{ padding: '16px' }}>
                        <div style={{ fontSize: '13px', marginBottom: '6px', color: 'var(--ios-green)', fontWeight: 500 }}>总额度</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ios-label-primary)' }}>${data.total.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '24px', fontSize: '17px' }}>
                <span className="text-secondary">剩余：</span>
                <span style={{ fontWeight: 600, color: isExhausted ? 'var(--ios-red)' : 'var(--ios-green)' }}>
                    ${data.remaining.toFixed(2)}
                </span>
            </div>

            <button onClick={onReset} className="link-btn" style={{ marginTop: '24px' }}>
                查询其他 Key
            </button>
        </div>
    );
};
