import useDeckStore from './store/deckStore';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import Toolbar from './components/Toolbar';
import SlidePanel from './components/SlidePanel';
import SlideCanvas from './components/SlideCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import AIChatPanel from './components/AIChatPanel';
import SettingsModal from './components/SettingsModal';
import TemplatePicker from './components/TemplatePicker';
import ShortcutsModal from './components/ShortcutsModal';
import FindReplace from './components/FindReplace';

function App() {
  const {
    rightTab,
    showSettings,
    showTemplates,
    showShortcuts,
    showFindReplace,
  } = useDeckStore();

  useKeyboardShortcuts();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      overflow: 'hidden',
    }}>
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main area: 3-panel layout */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Left: Slide thumbnails */}
        <div style={{
          width: 260,
          flexShrink: 0,
          background: 'var(--bg-panel)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <SlidePanel />
        </div>

        {/* Center: Canvas */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}>
          <SlideCanvas />
        </div>

        {/* Right: Properties / AI Chat */}
        <div style={{
          width: 320,
          flexShrink: 0,
          background: 'var(--bg-panel)',
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Tab header */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            flexShrink: 0,
          }}>
            <TabButton
              active={rightTab === 'properties'}
              onClick={() => useDeckStore.getState().setRightTab('properties')}
            >
              Properties
            </TabButton>
            <TabButton
              active={rightTab === 'ai'}
              onClick={() => useDeckStore.getState().setRightTab('ai')}
            >
              AI Chat
            </TabButton>
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {rightTab === 'properties' ? <PropertiesPanel /> : <AIChatPanel />}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSettings && <SettingsModal />}
      {showTemplates && <TemplatePicker />}
      {showShortcuts && <ShortcutsModal />}
      {showFindReplace && <FindReplace />}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '8px 0',
        background: active ? 'transparent' : 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >{children}</button>
  );
}

export default App;
