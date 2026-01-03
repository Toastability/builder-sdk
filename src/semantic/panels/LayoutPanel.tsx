/**
 * LayoutPanel Component
 *
 * Page structure tree view and block hierarchy
 * TODO: Implement drag-and-drop reordering and block management
 */

import React, { useState } from 'react';
import { Layout, ChevronRight, ChevronDown, Eye, EyeOff, Trash2, Copy } from 'lucide-react';
import { BasePanel, EmptyState } from '../components/BasePanel';
import { BasePanelProps } from '../types/semantic-builder';
import { ChaiBlock } from '@chaibuilder/sdk';

interface LayoutPanelProps extends BasePanelProps {}

interface TreeNode {
  id: string;
  type: string;
  label: string;
  isVisible: boolean;
  children: TreeNode[];
}

function BlockTreeItem({
  node,
  depth = 0,
  onToggleVisibility,
  onDelete,
  onDuplicate,
}: {
  node: TreeNode;
  depth?: number;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(depth < 2); // Auto-expand first 2 levels

  const hasChildren = node.children.length > 0;
  const indent = depth * 1.5; // 1.5rem per level

  return (
    <div>
      <div
        className="
          group flex items-center gap-2 px-3 py-2
          hover:bg-accent rounded-md
          transition-colors cursor-pointer
        "
        style={{ paddingLeft: `${indent + 0.75}rem` }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex-shrink-0 w-4 h-4
            text-muted-foreground hover:text-foreground
            transition-colors
            ${!hasChildren ? 'invisible' : ''}
          `}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Block Label */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-sm text-foreground truncate">{node.label}</span>
          <span className="text-xs text-muted-foreground font-mono">{node.type}</span>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(node.id);
            }}
            className="
              p-1 rounded
              text-muted-foreground hover:text-foreground
              hover:bg-accent transition-colors
            "
            title={node.isVisible ? 'Hide' : 'Show'}
          >
            {node.isVisible ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(node.id);
            }}
            className="
              p-1 rounded
              text-muted-foreground hover:text-foreground
              hover:bg-accent transition-colors
            "
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="
              p-1 rounded
              text-muted-foreground hover:text-destructive
              hover:bg-destructive/10 transition-colors
            "
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <BlockTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onToggleVisibility={onToggleVisibility}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LayoutPanel({
  pageId,
  websiteId,
  blocks,
  onBlocksChange,
}: LayoutPanelProps) {
  // Convert ChaiBlocks to tree structure
  const buildTree = (blocks: ChaiBlock[]): TreeNode[] => {
    return blocks.map((block) => ({
      id: block._id,
      type: block._type,
      label: block._name || block._type,
      isVisible: true, // TODO: Track visibility state
      children: block._children ? buildTree(block._children) : [],
    }));
  };

  const [treeNodes] = useState<TreeNode[]>(() => buildTree(blocks));

  const handleToggleVisibility = (id: string) => {
    console.log('Toggle visibility:', id);
    // TODO: Implement visibility toggle
    // Update block visibility and trigger re-render
  };

  const handleDelete = (id: string) => {
    console.log('Delete block:', id);
    // TODO: Implement block deletion
    // Remove block from tree and update parent component
  };

  const handleDuplicate = (id: string) => {
    console.log('Duplicate block:', id);
    // TODO: Implement block duplication
    // Clone block and insert after original
  };

  if (treeNodes.length === 0) {
    return (
      <BasePanel
        title="Page Layout"
        subtitle="View and manage page structure"
      >
        <EmptyState
          icon={<Layout className="w-12 h-12" />}
          title="No blocks on page"
          description="Start building your page by adding components from the Components tab or using the AI Chat assistant."
        />
      </BasePanel>
    );
  }

  return (
    <BasePanel
      title="Page Layout"
      subtitle="View and manage page structure"
    >
      <div className="flex flex-col h-full">
        {/* Tree View */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {treeNodes.map((node) => (
              <BlockTreeItem
                key={node.id}
                node={node}
                onToggleVisibility={handleToggleVisibility}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="flex-shrink-0 p-4 border-t border-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Blocks:</span>
              <span className="text-foreground font-medium">
                {blocks.length}
              </span>
            </div>
            <div className="p-2 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">
                Drag-and-drop reordering will be available in a future update. Use
                the visibility toggle to show/hide blocks in the preview.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BasePanel>
  );
}
