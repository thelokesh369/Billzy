import { type Screen } from '../App';

interface HeaderProps {
  navigateTo: (screen: Screen) => void;
  currentScreen: Screen;
}

export function Header({ navigateTo, currentScreen }: HeaderProps) {
  const navItems: { label: string; screen: Screen }[] = [
    { label: 'Dashboard', screen: 'dashboard' },
    { label: 'Upload Bills', screen: 'upload' },
    { label: 'Reports', screen: 'reports' },
  ];

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-foreground">Billzy</h1>
            <p className="text-muted-foreground text-sm">From Bill to GST in One Click</p>
          </div>
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.screen}
                onClick={() => navigateTo(item.screen)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentScreen === item.screen
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          Settings
        </button>
      </div>
    </header>
  );
}
