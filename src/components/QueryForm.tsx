import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface QueryFormProps {
    onSearch: (id: string) => void;
    isLoading: boolean;
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="ios-input-group">
                <input
                    type="text"
                    className="ios-input"
                    placeholder="请输入您的 API Key (sk-...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    autoComplete="off"
                    inputMode="text"
                    enterKeyHint="search"
                    disabled={isLoading}
                />
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ios-label-secondary)', pointerEvents: 'none' }}>
                    <Search size={20} />
                </div>
            </div>

            <button
                type="submit"
                className="ios-btn"
                disabled={isLoading || !query.trim()}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        查询中
                    </>
                ) : (
                    '查询额度'
                )}
            </button>
        </form>
    );
};
