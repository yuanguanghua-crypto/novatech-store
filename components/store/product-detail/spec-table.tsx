'use client'

interface Spec {
  label: string
  value: string
}

interface SpecTableProps {
  specs: Spec[]
}

export function SpecTable({ specs }: SpecTableProps) {
  if (!specs || specs.length === 0) return null

  return (
    <div>
      <h3 className="text-base font-bold mb-3" style={{ color: '#1F2A44' }}>
        Technical Specifications
      </h3>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
        <table className="w-full text-sm">
          <tbody>
            {specs.map((spec, i) => (
              <tr
                key={spec.label}
                style={{ backgroundColor: i % 2 === 0 ? '#FAFBFC' : 'white' }}
              >
                <td
                  className="px-4 py-2.5 font-medium w-1/3"
                  style={{ color: '#64748B' }}
                >
                  {spec.label}
                </td>
                <td className="px-4 py-2.5" style={{ color: '#1F2A44' }}>
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
