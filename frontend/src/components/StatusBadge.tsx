import { getStatusLabel, getStatusClass } from '../utils/helpers';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const label = getStatusLabel(status);
  const className = getStatusClass(status);

  return <span className={`badge badge--${className}`}>{label}</span>;
}
