import React from 'react';
import { Fragrance } from '../data/fragrances';
import { MoleculeXBottle } from './MoleculeXBottle';

interface PerfumeBottleProps {
  fragrance: Fragrance;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showPedestal?: boolean;
  pedestalHeight?: number;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  visualId?: string;
  svgId?: string;
}

export const PerfumeBottle: React.FC<PerfumeBottleProps> = ({
  fragrance,
  size = 'md',
  showPedestal = false,
  pedestalHeight,
  interactive = true,
  className = '',
  onClick,
  visualId,
  svgId,
}) => {
  return (
    <MoleculeXBottle
      fragrance={fragrance}
      name={fragrance.name}
      size={size}
      showPedestal={showPedestal}
      pedestalHeight={pedestalHeight}
      interactive={interactive}
      className={className}
      onClick={onClick}
      visualId={visualId}
      svgId={svgId}
    />
  );
};
