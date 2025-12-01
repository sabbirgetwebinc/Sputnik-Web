import React, { useMemo } from 'react';
import { ArtifactType } from '../types';
import { SERVICES } from '../constants';

interface ServiceGridProps {
  artifact: string;
  type: ArtifactType;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ artifact, type }) => {
  const services = useMemo(() => SERVICES[type] || [], [type]);

  const handleOpenAll = () => {
    if (services.length > 5) {
      if (!window.confirm(`You are about to open ${services.length} tabs. This might trigger popup blockers. Continue?`)) {
        return;
      }
    }
    
    services.forEach(service => {
      const url = service.urlBuilder(artifact);
      window.open(url, '_blank');
    });
  };

  if (type === ArtifactType.UNKNOWN && artifact.length > 0) {
    return (
      <div className="text-center p-8 text-slate-500 border border-slate-800 border-dashed rounded-xl">
        <p>Could not automatically detect artifact type. Please check the format.</p>
      </div>
    );
  }

  if (artifact.length === 0) {
    return (
      <div className="text-center p-12 text-slate-500 border border-slate-800 border-dashed rounded-xl bg-slate-900/30">
        <p>Enter an IP, Domain, Hash, or URL to see available tools.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-400">
          Available Tools ({services.length})
        </span>
        <button
          onClick={handleOpenAll}
          className="text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Open All Tabs
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {services.map((service) => (
          <a
            key={service.id}
            href={service.urlBuilder(artifact)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-all duration-200"
          >
            <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 truncate">
              {service.name}
            </span>
            <span className="text-xs text-slate-500 mt-1 truncate group-hover:text-slate-400">
              Open in new tab &rarr;
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ServiceGrid;