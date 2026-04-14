import { motion } from 'framer-motion';

/**
 * Global status badge — light theme.
 * Usage: <StatusBadge status="PENDING" />
 */
const STATUS_MAP = {
  PENDING:                     { label: 'Pending',       cls: 'bg-amber-50  text-amber-700  border-amber-200',   pulse: true  },
  PENDING_NGO_VERIFICATION:    { label: 'Pending NGO',   cls: 'bg-amber-50  text-amber-700  border-amber-200',   pulse: true  },
  PENDING_GOVERNMENT_APPROVAL: { label: 'Pending Gov.',  cls: 'bg-orange-50 text-orange-700 border-orange-200',  pulse: true  },
  VERIFIED:                    { label: 'Verified',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', pulse: false },
  APPROVED:                    { label: 'Approved',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', pulse: false },
  REJECTED:                    { label: 'Rejected',      cls: 'bg-red-50    text-red-700    border-red-200',     pulse: false },
  LISTED:                      { label: 'Listed',        cls: 'bg-blue-50   text-blue-700   border-blue-200',    pulse: false },
  SOLD:                        { label: 'Sold',          cls: 'bg-purple-50 text-purple-700 border-purple-200',  pulse: false },
  COMPLETED:                   { label: 'Completed',     cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', pulse: false },
  FAILED:                      { label: 'Failed',        cls: 'bg-red-50    text-red-700    border-red-200',     pulse: false },
  PROCESSING:                  { label: 'Processing',    cls: 'bg-blue-50   text-blue-700   border-blue-200',    pulse: true  },
  ACTIVE:                      { label: 'Active',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', pulse: false },
  INACTIVE:                    { label: 'Inactive',      cls: 'bg-gray-100  text-gray-500   border-gray-200',    pulse: false },
};

const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;
  const config = STATUS_MAP[status] || {
    label: status.replace(/_/g, ' '),
    cls: 'bg-gray-100 text-gray-600 border-gray-200',
    pulse: false,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ring-0 ${config.cls} ${className}`}
    >
      {config.pulse ? (
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-current"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
