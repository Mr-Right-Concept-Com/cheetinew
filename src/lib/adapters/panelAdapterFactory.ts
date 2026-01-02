import { PanelAdapter, PanelCredentials, PanelType } from './types';
import { CPanelAdapter } from './panels/cpanelAdapter';
import { PleskAdapter } from './panels/pleskAdapter';
import { HostingerAdapter } from './panels/hostingerAdapter';
import { SpaceshipAdapter } from './panels/spaceshipAdapter';

// Panel Adapter Factory - Creates the right adapter based on panel type
export class PanelAdapterFactory {
  private static adapters: Map<string, PanelAdapter> = new Map();
  
  static createAdapter(credentials: PanelCredentials): PanelAdapter {
    const key = `${credentials.panelType}-${credentials.id}`;
    
    if (this.adapters.has(key)) {
      return this.adapters.get(key)!;
    }
    
    let adapter: PanelAdapter;
    
    switch (credentials.panelType) {
      case 'cpanel':
        adapter = new CPanelAdapter(credentials);
        break;
      case 'plesk':
        adapter = new PleskAdapter(credentials);
        break;
      case 'hostinger':
        adapter = new HostingerAdapter(credentials);
        break;
      case 'spaceship':
        adapter = new SpaceshipAdapter(credentials);
        break;
      case 'custom':
        // For custom panels, we can extend with user-provided adapters
        throw new Error('Custom adapters must be registered separately');
      default:
        throw new Error(`Unsupported panel type: ${credentials.panelType}`);
    }
    
    this.adapters.set(key, adapter);
    return adapter;
  }
  
  static getAdapter(panelId: string): PanelAdapter | undefined {
    for (const [key, adapter] of this.adapters) {
      if (key.includes(panelId)) {
        return adapter;
      }
    }
    return undefined;
  }
  
  static removeAdapter(panelId: string): boolean {
    for (const [key] of this.adapters) {
      if (key.includes(panelId)) {
        this.adapters.delete(key);
        return true;
      }
    }
    return false;
  }
  
  static getAllAdapters(): Map<string, PanelAdapter> {
    return new Map(this.adapters);
  }
  
  static getSupportedPanels(): PanelType[] {
    return ['cpanel', 'plesk', 'hostinger', 'spaceship', 'custom'];
  }
}
