import styles from './brand.module.css';
import { TextureOverlay } from './TextureOverlay';

type BrandedBackdropProps = {
  withScan?: boolean;
  className?: string;
};

export function BrandedBackdrop({
  withScan = false,
  className = '',
}: BrandedBackdropProps) {
  return (
    <div aria-hidden className={`${styles.brandedBackdrop} ${className}`}>
      <TextureOverlay variant="grid" intensity="subtle" />
      <TextureOverlay variant="grain" intensity="subtle" />
      <span className={styles.glow} />
      {withScan ? <TextureOverlay variant="scan" intensity="subtle" /> : null}
    </div>
  );
}
