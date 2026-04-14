/**
 * SkeletonRow — light-theme skeleton loader for tables.
 * Usage: <SkeletonRow cols={5} rows={4} />
 */
const SkeletonRow = ({ cols = 4, rows = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, ri) => (
      <tr key={ri} className="border-b border-gray-100">
        {Array.from({ length: cols }).map((_, ci) => (
          <td key={ci} className="p-4">
            <div
              className="skeleton h-4 rounded"
              style={{ width: ci === 0 ? '5rem' : ci === cols - 1 ? '4rem' : '80%' }}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default SkeletonRow;
