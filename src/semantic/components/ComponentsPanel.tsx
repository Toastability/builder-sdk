/**
 * ComponentsPanel Component
 *
 * Integrates ChaiBuilder's AddBlocksPanel into the semantic builder's Components tab
 * Provides block browsing, search, and insertion capabilities
 */

import AddBlocksPanel from '../../core/components/sidepanels/panels/add-blocks/add-blocks';
import { BasePanel } from './BasePanel';

interface ComponentsPanelProps {
  /** Page ID for context */
  pageId: string | number;

  /** Website ID for context */
  websiteId: string | number;

  /** Current page blocks */
  blocks: any[];

  /** Optional callback when blocks change */
  onBlocksChange?: (blocks: any[]) => void;

  /** Optional parent ID for inserting blocks */
  parentId?: string;

  /** Optional position for inserting blocks */
  position?: number;
}

/**
 * ComponentsPanel integrates the ChaiBuilder block library
 * into the semantic builder interface
 */
export function ComponentsPanel({
  pageId: _pageId,
  websiteId: _websiteId,
  blocks: _blocks,
  onBlocksChange: _onBlocksChange,
  parentId,
  position = -1,
}: ComponentsPanelProps) {
  return (
    <BasePanel
      title="Components"
      subtitle="Browse and search UI components and blocks"
    >
      <div className="h-full w-full overflow-hidden">
        <AddBlocksPanel
          className="h-full"
          showHeading={false}
          parentId={parentId}
          position={position}
        />
      </div>
    </BasePanel>
  );
}
