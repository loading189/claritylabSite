export type ContentVariant = 'default' | 'variantA' | 'variantB';

export type VariantContent<T> = {
  default: T;
  variantA?: T;
  variantB?: T;
};

export function pickVariant<T>(
  content: VariantContent<T>,
  variant: ContentVariant = 'default',
): T {
  return content[variant] ?? content.default;
}
