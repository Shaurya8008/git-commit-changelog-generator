import React, { useState, useEffect } from 'react';
import { generateChangelog } from '../utils/parser';
import type { ChangelogConfig, CommitType } from '../utils/parser';
import { Copy, Check, Settings2, Code, GitCommit, ListEnd } from 'lucide-react';

export const ChangelogGenerator: React.FC = () => {
  const [inputLog, setInputLog] = useState('');
  const [outputMarkdown, setOutputMarkdown] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [config, setConfig] = useState<ChangelogConfig>({
    groupByType: true,
    includeHashes: true,
    ignoredTypes: ['chore', 'other']
  });

  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    if (inputLog.trim() === '') {
      setOutputMarkdown('');
      return;
    }
    const markdown = generateChangelog(inputLog, config);
    setOutputMarkdown(markdown);
  }, [inputLog, config]);

  const handleCopy = async () => {
    if (!outputMarkdown) return;
    try {
      await navigator.clipboard.writeText(outputMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleIgnoredType = (type: CommitType) => {
    setConfig(prev => {
      const isIgnored = prev.ignoredTypes.includes(type);
      return {
        ...prev,
        ignoredTypes: isIgnored 
          ? prev.ignoredTypes.filter(t => t !== type)
          : [...prev.ignoredTypes, type]
      };
    });
  };

  const availableTypes: { type: CommitType, label: string }[] = [
    { type: 'feat', label: 'Features' },
    { type: 'fix', label: 'Bug Fixes' },
    { type: 'perf', label: 'Performance' },
    { type: 'docs', label: 'Documentation' },
    { type: 'style', label: 'Styles' },
    { type: 'refactor', label: 'Refactoring' },
    { type: 'test', label: 'Tests' },
    { type: 'build', label: 'Build' },
    { type: 'ci', label: 'CI' },
    { type: 'chore', label: 'Chores' },
    { type: 'other', label: 'Other' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      
      <header className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', marginBottom: '1rem', animation: 'pulse-glow 3s infinite' }}>
          <GitCommit size={32} color="var(--accent-color)" />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(to right, #818cf8, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Changelog Generator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Paste your raw git commit log below, and instantly get a beautifully formatted, conventional markdown changelog.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="animate-fade-in-delayed">
        
        {/* Input Section */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={20} color="var(--accent-color)" />
              Raw Git Log
            </h2>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              onClick={() => setShowConfig(!showConfig)}
            >
              <Settings2 size={16} />
              {showConfig ? 'Hide Settings' : 'Settings'}
            </button>
          </div>

          {showConfig && (
            <div className="animate-fade-in" style={{ background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Formatting Options</h3>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={config.groupByType}
                    onChange={(e) => setConfig({...config, groupByType: e.target.checked})}
                  />
                  <span className="checkmark"></span>
                  <span style={{ fontSize: '0.9rem' }}>Group by Type</span>
                </label>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={config.includeHashes}
                    onChange={(e) => setConfig({...config, includeHashes: e.target.checked})}
                  />
                  <span className="checkmark"></span>
                  <span style={{ fontSize: '0.9rem' }}>Include Commit Hashes</span>
                </label>
              </div>

              <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Include Types</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {availableTypes.map(({ type, label }) => {
                  const isIncluded = !config.ignoredTypes.includes(type);
                  return (
                    <label key={type} className="checkbox-container" style={{ width: 'calc(33% - 8px)' }}>
                      <input 
                        type="checkbox" 
                        checked={isIncluded}
                        onChange={() => toggleIgnoredType(type)}
                      />
                      <span className="checkmark"></span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <textarea 
            className="textarea-input" 
            placeholder={"Paste git log here...\n\nExample:\nabc1234 feat(ui): add new button\ndef5678 fix: resolve crash on startup\n9101112 chore: update dependencies"}
            value={inputLog}
            onChange={(e) => setInputLog(e.target.value)}
            style={{ flexGrow: 1 }}
          />
        </div>

        {/* Output Section */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListEnd size={20} color="var(--success-color)" />
              Markdown Output
            </h2>
            <button 
              className={`btn ${copied ? 'btn-secondary' : 'btn-primary'}`}
              style={{ padding: '8px 16px', ...(copied ? { borderColor: 'var(--success-color)', color: 'var(--success-color)' } : {}) }}
              onClick={handleCopy}
              disabled={!outputMarkdown}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Markdown'}
            </button>
          </div>

          <div style={{ 
            flexGrow: 1, 
            background: 'rgba(0,0,0,0.3)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '12px', 
            padding: '20px',
            overflowY: 'auto',
            maxHeight: '600px',
            position: 'relative'
          }}>
            {outputMarkdown ? (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: '"Fira Code", monospace', fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {outputMarkdown}
              </pre>
            ) : (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
                <ListEnd size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p>Output will appear here</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
