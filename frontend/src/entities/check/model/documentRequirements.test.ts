import { getDocumentRequirements, getDocumentRequirementStates } from './documentRequirements'

describe('documentRequirements', () => {
  it('returns required documents for federal program', () => {
    expect(getDocumentRequirements('federal')).toEqual([
      { type: 'contract', label: 'Договор', required: true },
      { type: 'spec', label: 'Спецификация', required: true },
      { type: 'invoice', label: 'Счёт на оплату', required: true },
      { type: 'act', label: 'Акт / УПД', required: true },
    ])
  })

  it('marks spec as recommended for regional program', () => {
    expect(getDocumentRequirements('regional')).toContainEqual({
      type: 'spec',
      label: 'Спецификация',
      required: false,
    })
  })

  it('builds document requirement states from detected documents', () => {
    expect(
      getDocumentRequirementStates('federal', [
        { detected_type: 'contract', name: 'dogovor.pdf', size_kb: 1 },
        { detected_type: 'invoice', name: 'invoice.pdf', size_kb: 1 },
      ]),
    ).toEqual([
      { type: 'contract', label: 'Договор', required: true, found: true },
      { type: 'spec', label: 'Спецификация', required: true, found: false },
      { type: 'invoice', label: 'Счёт на оплату', required: true, found: true },
      { type: 'act', label: 'Акт / УПД', required: true, found: false },
    ])
  })
})
