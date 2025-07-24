// DevContainer学習ガイド - JavaScript機能

class DevContainerGuide {
    constructor() {
        this.sections = {
            concepts: { total: 5, key: 'concepts' },
            setup: { total: 8, key: 'setup' },
            devcontainer: { total: 6, key: 'devcontainer' },
            practice: { total: 10, key: 'practice' },
            claude: { total: 4, key: 'claude' },
            troubleshooting: { total: 6, key: 'troubleshooting' }
        };
        
        this.init();
    }

    init() {
        this.loadProgress();
        this.updateProgressDisplay();
        this.checkSystemRequirements();
        this.setupEventListeners();
        this.initTheme();
        
        // ページロード完了時のアニメーション
        document.addEventListener('DOMContentLoaded', () => {
            this.animateElements();
        });
    }

    // 進捗管理
    loadProgress() {
        this.progress = JSON.parse(localStorage.getItem('devcontainer-progress') || '{}');
        
        // 初期化
        Object.keys(this.sections).forEach(section => {
            if (!this.progress[section]) {
                this.progress[section] = 0;
            }
        });
    }

    saveProgress() {
        localStorage.setItem('devcontainer-progress', JSON.stringify(this.progress));
        this.updateProgressDisplay();
    }

    updateProgress(section, completed) {
        if (this.sections[section]) {
            this.progress[section] = Math.min(completed, this.sections[section].total);
            this.saveProgress();
        }
    }

    updateProgressDisplay() {
        // 全体進捗を計算
        let totalCompleted = 0;
        let totalItems = 0;
        
        Object.keys(this.sections).forEach(section => {
            const completed = this.progress[section] || 0;
            const total = this.sections[section].total;
            
            totalCompleted += completed;
            totalItems += total;
            
            // 各セクションの進捗バーを更新
            const progressBar = document.querySelector(`[data-progress="${section}"]`);
            const progressText = document.querySelector(`[data-progress-text="${section}"]`);
            
            if (progressBar && progressText) {
                const percentage = (completed / total) * 100;
                progressBar.style.width = `${percentage}%`;
                progressText.textContent = `${completed}/${total} 完了`;
            }
        });
        
        // 全体進捗バーを更新
        const overallProgress = document.getElementById('overall-progress');
        const progressText = document.getElementById('progress-text');
        
        if (overallProgress && progressText) {
            const percentage = (totalCompleted / totalItems) * 100;
            overallProgress.style.width = `${percentage}%`;
            progressText.textContent = `進捗: ${Math.round(percentage)}% (${totalCompleted}/${totalItems})`;
        }
    }

    resetProgress() {
        if (confirm('すべての進捗をリセットしますか？この操作は元に戻せません。')) {
            this.progress = {};
            Object.keys(this.sections).forEach(section => {
                this.progress[section] = 0;
            });
            this.saveProgress();
            this.showNotification('進捗をリセットしました', 'success');
        }
    }

    exportProgress() {
        const exportData = {
            progress: this.progress,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devcontainer-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('進捗をエクスポートしました', 'success');
    }

    importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                if (importData.progress) {
                    this.progress = importData.progress;
                    this.saveProgress();
                    this.showNotification('進捗をインポートしました', 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showNotification('ファイルの読み込みに失敗しました', 'error');
            }
        };
        reader.readAsText(file);
    }

    // テーマ管理
    initTheme() {
        const savedTheme = localStorage.getItem('devcontainer-theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('devcontainer-theme', theme);
        
        const themeToggleText = document.getElementById('theme-toggle-text');
        if (themeToggleText) {
            themeToggleText.textContent = theme === 'dark' ? 'ライトモード' : 'ダークモード';
        }
    }

    toggleDarkMode() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    // システム要件チェック
    checkSystemRequirements() {
        this.checkOS();
        this.checkWSL();
        this.checkDocker();
        this.checkVSCode();
    }

    checkOS() {
        const statusElement = document.getElementById('os-status');
        if (!statusElement) return;

        const userAgent = navigator.userAgent;
        let status = 'manual';
        let text = '要確認';

        if (userAgent.includes('Windows NT')) {
            const windowsVersion = this.getWindowsVersion(userAgent);
            if (windowsVersion >= 10) {
                status = 'success';
                text = `Windows ${windowsVersion} ✓`;
            } else {
                status = 'error';
                text = `Windows ${windowsVersion} (要更新)`;
            }
        } else {
            text = 'Windows以外のOS';
        }

        this.updateCheckStatus('os-status', status, text);
    }

    getWindowsVersion(userAgent) {
        const match = userAgent.match(/Windows NT (\d+\.\d+)/);
        if (match) {
            const version = parseFloat(match[1]);
            if (version >= 10.0) return 11; // Windows 11は10.0として報告される場合がある
            if (version >= 6.2) return 10;
            return Math.floor(version);
        }
        return 0;
    }

    checkWSL() {
        // ブラウザからは直接確認できないため、手動確認を促す
        this.updateCheckStatus('wsl-status', 'manual', '手動確認必要');
    }

    checkDocker() {
        // ブラウザからは直接確認できないため、手動確認を促す
        this.updateCheckStatus('docker-status', 'manual', '手動確認必要');
    }

    checkVSCode() {
        // ブラウザからは直接確認できないため、手動確認を促す
        this.updateCheckStatus('vscode-status', 'manual', '手動確認必要');
    }

    updateCheckStatus(elementId, status, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
            element.className = `check-status ${status}`;
        }
    }

    // イベントリスナー設定
    setupEventListeners() {
        // テーマ切り替えボタン（グローバル関数として定義）
        window.toggleDarkMode = () => this.toggleDarkMode();
        window.resetProgress = () => this.resetProgress();
        window.exportProgress = () => this.exportProgress();

        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'd':
                        e.preventDefault();
                        this.toggleDarkMode();
                        break;
                    case 'r':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.resetProgress();
                        }
                        break;
                    case 's':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.exportProgress();
                        }
                        break;
                }
            }
        });

        // ファイルドロップ機能（進捗インポート用）
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/json') {
                this.importProgress(files[0]);
            }
        });
    }

    // アニメーション
    animateElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // アニメーション対象要素を監視
        document.querySelectorAll('.overview-card, .nav-card, .flow-step').forEach(el => {
            observer.observe(el);
        });
    }

    // 通知システム
    showNotification(message, type = 'info') {
        // 既存の通知を削除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 新しい通知を作成
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // スタイルを追加
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 12px var(--shadow);
            z-index: 999;
            max-width: 350px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        if (type === 'success') {
            notification.style.borderLeft = '4px solid var(--success)';
        } else if (type === 'error') {
            notification.style.borderLeft = '4px solid var(--error)';
        } else if (type === 'warning') {
            notification.style.borderLeft = '4px solid var(--warning)';
        }

        document.body.appendChild(notification);

        // アニメーション
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // 自動削除
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ユーティリティメソッド
    formatDate(date) {
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    // 進捗統計
    getProgressStats() {
        let totalCompleted = 0;
        let totalItems = 0;
        const sectionStats = {};

        Object.keys(this.sections).forEach(section => {
            const completed = this.progress[section] || 0;
            const total = this.sections[section].total;
            
            totalCompleted += completed;
            totalItems += total;
            
            sectionStats[section] = {
                completed,
                total,
                percentage: Math.round((completed / total) * 100)
            };
        });

        return {
            totalCompleted,
            totalItems,
            overallPercentage: Math.round((totalCompleted / totalItems) * 100),
            sections: sectionStats
        };
    }
}

// CSS for notifications
const notificationStyles = `
.notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.notification-message {
    color: var(--text-color);
    font-size: 0.9rem;
}

.notification-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--text-light);
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s ease;
}

.notification-close:hover {
    background-color: var(--border);
}
`;

// スタイルを動的に追加
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// アプリケーション初期化
const app = new DevContainerGuide();

// デバッグ用のグローバル関数（開発時のみ）
window.devcontainerApp = app;