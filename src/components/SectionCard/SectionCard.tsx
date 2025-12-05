
import React, { ReactNode } from 'react';
import './SectionCard.css';

type SectionCardProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  emphasize?: boolean;
};

const SectionCard = ({ title, description, actions, children, emphasize = false }: SectionCardProps) => {
  return (
    <section className={`section-card ${emphasize ? 'section-card--emphasize' : ''}`}>
      <header className="section-card__header">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="section-card__actions">{actions}</div>}
      </header>
      <div className="section-card__body">{children}</div>
    </section>
  );
};

export default SectionCard;
