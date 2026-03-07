import { VariantContent } from './variants';

export const scanLandingContent = {
  metadataTitle: 'Clarity Scan',
  metadataDescription:
    'Use the Clarity Scan to get a fast operational read before booking a call.',
  heading: 'Clarity Scan',
  lead: {
    default:
      'In about three minutes, spot your strongest pressure signals and get a practical starting point before you book.',
    variantA:
      'Take three minutes to understand what may be slowing things down before you decide on a next step.',
  } satisfies VariantContent<string>,
  loadingLabel: 'Loading scan…',
} as const;
