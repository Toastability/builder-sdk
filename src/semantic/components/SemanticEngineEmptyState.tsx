/**
 * SemanticEngineEmptyState Component
 *
 * Empty state for semantic UI engine when no design_payload exists
 * Shows gradient overlay with skeleton cards and AI Agent trigger button
 */

import { Brain } from "lucide-react";

export function SemanticEngineEmptyState() {
  return (
    <>
      <div className="relative">
        <ul
          role="list"
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <li className="h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle" />
          <li className="h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle" />
          <li className="hidden h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle sm:block" />
          <li className="hidden h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle sm:block" />
          <li className="hidden h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle sm:block" />
          <li className="hidden h-44 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle sm:block" />
        </ul>
        {/* Change dark:from-gray-950 in parent below according to your dark mode background */}
        <div className="absolute inset-x-0 bottom-0 flex h-32 flex-col items-center justify-center bg-gradient-to-t from-white to-transparent dark:from-gray-950">
          <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            No content created yet
          </p>
          <p className="mt-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            Would you like for us to take care of it?
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-1.5 whitespace-nowrap rounded-tremor-small bg-tremor-brand px-3 py-2 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-dropdown hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-dropdown dark:hover:bg-dark-tremor-brand-emphasis"
          >
            <Brain className="-ml-1 size-5 shrink-0" aria-hidden={true} />
            Run AI Page Design Agent
          </button>
        </div>
      </div>
    </>
  );
}
