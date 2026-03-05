import styles from './brand.module.css';

type TextureOverlayProps = {
  variant: 'grain' | 'grid' | 'scan';
  intensity?: 'subtle' | 'medium';
  className?: string;
};

export function TextureOverlay({
  variant,
  intensity = 'subtle',
  className = '',
}: TextureOverlayProps) {
  return (
    <span
      aria-hidden
      className={`${styles.textureOverlay} ${styles[variant]} ${styles[intensity]} ${className}`}
    />
  );
}
