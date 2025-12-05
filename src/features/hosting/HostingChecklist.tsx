
import React from 'react';
import SectionCard from '../../components/SectionCard/SectionCard';
import { persistenceDriver, type PersistenceDriver } from '../../utils/persistence';
import './HostingChecklist.css';

type ChecklistStatus = 'pass' | 'warn';

type ChecklistItem = {
  title: string;
  detail: string;
  status: ChecklistStatus;
};

const persistenceDescriptions: Record<PersistenceDriver, string> = {
  indexedDB: 'Drafts survive reloads via the built-in IndexedDB persistence layer.',
  native: 'Browser-native persistence keeps drafts intact between visits.',
  memory: 'Session-only storage is active. Refreshing the page will clear your draft.',
};

const HostingChecklist = () => {
  const persistenceStatus: ChecklistStatus = persistenceDriver === 'memory' ? 'warn' : 'pass';

  const items: ChecklistItem[] = [
    {
      title: 'Static-path friendly',
      detail: 'All modules are referenced with relative paths, so /username.github.io/repo/ works without extra config.',
      status: 'pass',
    },
    {
      title: 'Refresh-proof routing',
      detail: 'No custom router is used, so GitHub Pages never returns a 404 when you reload deep links.',
      status: 'pass',
    },
    {
      title: 'Draft storage backend',
      detail: persistenceDescriptions[persistenceDriver],
      status: persistenceStatus,
    },
    {
      title: 'HTTPS clipboard ready',
      detail: 'Copy-to-clipboard stays available because GitHub Pages serves the app over HTTPS automatically.',
      status: 'pass',
    },
  ];

  return (
    <SectionCard
      title="GitHub Pages readiness"
      description="A deployment checklist so you can publish the tool with confidence."
    >
      <ul className="hosting-checklist">
        {items.map((item) => (
          <li
            key={item.title}
            className={`hosting-checklist__item hosting-checklist__item--${item.status}`}
          >
            <span className="hosting-checklist__icon" aria-hidden="true">
              {item.status === 'pass' ? '✓' : '!'}
            </span>
            <div>
              <p className="hosting-checklist__title">{item.title}</p>
              <p className="hosting-checklist__detail">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
};

export default HostingChecklist;
