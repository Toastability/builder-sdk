/**
 * DataPanel Component
 *
 * External data sources and API connections
 * TODO: Implement data source management and binding
 */

import { useState } from 'react';
import { Database, Plus, Link2, RefreshCw, Settings } from 'lucide-react';
import { BasePanel, EmptyState } from '../components/BasePanel';
import { BasePanelProps } from '../types/semantic-builder';

interface DataPanelProps extends BasePanelProps {}

interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'database' | 'cms' | 'spreadsheet';
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

export function DataPanel({
  pageId: _pageId,
  websiteId: _websiteId,
  blocks: _blocks,
  onBlocksChange: _onBlocksChange,
}: DataPanelProps) {
  // Placeholder data sources
  const [dataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Products API',
      type: 'api',
      url: 'https://api.example.com/products',
      status: 'connected',
      lastSync: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: '2',
      name: 'Blog Posts CMS',
      type: 'cms',
      url: 'https://cms.example.com',
      status: 'connected',
      lastSync: new Date(Date.now() - 1000 * 60 * 30),
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-yellow-500';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'api':
        return <Link2 className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'cms':
        return <RefreshCw className="w-4 h-4" />;
      case 'spreadsheet':
        return <Settings className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (dataSources.length === 0 && !showAddForm) {
    return (
      <BasePanel
        title="Data Sources"
        subtitle="Connect external data and APIs"
        showHeader={false}
      >
        <EmptyState
          icon={<Database className="w-12 h-12" />}
          title="No data sources connected"
          description="Connect external APIs, databases, or CMS platforms to dynamically populate your page content."
          action={{
            label: 'Add Data Source',
            onClick: () => setShowAddForm(true),
          }}
        />
      </BasePanel>
    );
  }

  if (showAddForm) {
    return (
      <BasePanel
        title="Add Data Source"
        subtitle="Connect a new external data source"
        showHeader={false}
        actions={
          <button
            onClick={() => setShowAddForm(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        }
      >
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Data Source Type
            </label>
            <select
              className="
                w-full px-3 py-2 rounded-md
                bg-muted text-foreground text-sm
                border border-border
                outline-none
                focus:ring-2 focus:ring-primary
              "
            >
              <option value="api">REST API</option>
              <option value="database">Database</option>
              <option value="cms">CMS Platform</option>
              <option value="spreadsheet">Spreadsheet</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Name
            </label>
            <input
              type="text"
              placeholder="My API"
              className="
                w-full px-3 py-2 rounded-md
                bg-muted text-foreground text-sm
                border border-border
                outline-none
                focus:ring-2 focus:ring-primary
              "
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Endpoint URL
            </label>
            <input
              type="url"
              placeholder="https://api.example.com/endpoint"
              className="
                w-full px-3 py-2 rounded-md
                bg-muted text-foreground text-sm font-mono
                border border-border
                outline-none
                focus:ring-2 focus:ring-primary
              "
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Authentication
            </label>
            <select
              className="
                w-full px-3 py-2 rounded-md
                bg-muted text-foreground text-sm
                border border-border
                outline-none
                focus:ring-2 focus:ring-primary
              "
            >
              <option value="none">None</option>
              <option value="api-key">API Key</option>
              <option value="bearer">Bearer Token</option>
              <option value="basic">Basic Auth</option>
              <option value="oauth">OAuth 2.0</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              className="
                flex-1 px-4 py-2 rounded-md
                bg-primary text-primary-foreground
                hover:bg-primary/90
                transition-colors
                text-sm font-medium
              "
            >
              Test Connection
            </button>
            <button
              className="
                flex-1 px-4 py-2 rounded-md
                bg-muted text-foreground
                hover:bg-accent
                transition-colors
                text-sm font-medium
              "
            >
              Add Source
            </button>
          </div>

          <p className="text-xs text-muted-foreground px-3 py-2 bg-muted rounded-md">
            Data source integration will be fully implemented in a future phase.
          </p>
        </div>
      </BasePanel>
    );
  }

  return (
    <BasePanel
      title="Data Sources"
      subtitle="Connect external data and APIs"
      showHeader={false}
      actions={
        <button
          onClick={() => setShowAddForm(true)}
          className="
            flex items-center gap-1
            px-3 py-1.5 rounded-md
            bg-primary text-primary-foreground
            hover:bg-primary/90
            transition-colors
            text-sm font-medium
          "
        >
          <Plus className="w-4 h-4" />
          Add Source
        </button>
      }
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {/* Data Sources List */}
          <div className="p-4 space-y-3">
            {dataSources.map((source) => (
              <div
                key={source.id}
                className="
                  p-4 rounded-lg border border-border
                  bg-card hover:bg-accent
                  transition-colors cursor-pointer
                "
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {getTypeIcon(source.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground">
                        {source.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                        {source.url}
                      </p>
                      {source.lastSync && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {formatTimeAgo(source.lastSync)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        flex items-center gap-1.5
                        text-xs font-medium
                        ${getStatusColor(source.status)}
                      `}
                    >
                      <div className="w-2 h-2 rounded-full bg-current" />
                      {source.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <button
                    className="
                      flex items-center gap-1
                      px-2 py-1 rounded
                      text-xs text-muted-foreground
                      hover:text-foreground hover:bg-accent
                      transition-colors
                    "
                  >
                    <RefreshCw className="w-3 h-3" />
                    Sync
                  </button>
                  <button
                    className="
                      flex items-center gap-1
                      px-2 py-1 rounded
                      text-xs text-muted-foreground
                      hover:text-foreground hover:bg-accent
                      transition-colors
                    "
                  >
                    <Settings className="w-3 h-3" />
                    Configure
                  </button>
                  <button
                    className="
                      flex items-center gap-1
                      px-2 py-1 rounded
                      text-xs text-muted-foreground
                      hover:text-foreground hover:bg-accent
                      transition-colors
                    "
                  >
                    <Link2 className="w-3 h-3" />
                    Bind Data
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Data Binding Info */}
          <div className="px-4 pb-4">
            <div className="p-3 bg-muted rounded-md space-y-2">
              <h4 className="text-xs font-medium text-foreground">
                Data Binding
              </h4>
              <p className="text-xs text-muted-foreground">
                Connect data sources to your components to dynamically populate
                content. Click "Bind Data" on a source to configure field mappings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BasePanel>
  );
}
