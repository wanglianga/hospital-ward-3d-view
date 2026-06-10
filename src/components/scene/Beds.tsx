import { useMemo } from 'react';
import { useWardStore } from '@/store/useWardStore';
import { Bed } from './Bed';

export function Beds() {
  const beds = useWardStore((s) => s.beds);
  const perspective = useWardStore((s) => s.perspective);

  const sortedBeds = useMemo(() => {
    if (perspective === 'cleaner') {
      return [...beds].sort((a, b) => {
        if (a.status === 'cleaning' && b.status !== 'cleaning') return -1;
        if (a.status !== 'cleaning' && b.status === 'cleaning') return 1;
        if (a.status === 'cleaning' && b.status === 'cleaning') {
          return (b.cleaningPriority || 0) - (a.cleaningPriority || 0);
        }
        return 0;
      });
    }
    return beds;
  }, [beds, perspective]);

  return (
    <group>
      {sortedBeds.map((bed) => (
        <Bed key={bed.id} bed={bed} />
      ))}
    </group>
  );
}
