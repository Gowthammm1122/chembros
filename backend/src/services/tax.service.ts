import { prisma } from '../config/db.js';

export interface GstBreakdown {
  isInclusive: boolean;
  taxRateBps: number; // e.g. 1800 basis points = 18.00%
  taxRatePercent: number; // 18.00
  grossTotal: number;
  taxAmount: number;
  netSubtotal: number;
  isHomeState: boolean;
  destinationState: string;
  cgst: number;
  sgst: number;
  igst: number;
  hsn: string;
}

export class TaxService {
  public static readonly DEFAULT_HOME_STATE = 'Tamil Nadu';
  public static readonly DEFAULT_HSN = '33030050';
  public static readonly DEFAULT_RATE_BPS = 1800; // 18%

  /**
   * Normalizes state names for accurate intra-state comparison
   */
  public static isTamilNadu(stateName?: string): boolean {
    if (!stateName) return true; // Default to home state if not provided yet
    const clean = stateName.toLowerCase().replace(/[^a-z]/g, '');
    return clean === 'tamilnadu' || clean === 'tn' || clean === 'chennai';
  }

  /**
   * Calculates statutory 18% GST with CGST, SGST, or IGST breakdown.
   * Chemical Brothers luxury fragrances have tax-inclusive retail pricing.
   *
   * Formula:
   * Tax Component = Gross * (Rate / (10000 + Rate))
   * Net Component = Gross - Tax Component
   */
  public static calculate(
    grossAmount: number,
    destinationState: string = 'Tamil Nadu',
    rateBps: number = TaxService.DEFAULT_RATE_BPS
  ): GstBreakdown {
    const isHome = this.isTamilNadu(destinationState);

    // Exact integer rupee calculations using basis points
    // For 18%: 1800 / 11800 = 18 / 118
    const taxAmount = Math.round((grossAmount * rateBps) / (10000 + rateBps));
    const netSubtotal = grossAmount - taxAmount;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isHome) {
      // Intra-state supply (Tamil Nadu to Tamil Nadu): 9% CGST + 9% SGST
      cgst = Math.round(taxAmount / 2);
      sgst = taxAmount - cgst; // Ensure exact rupee reconciliation
    } else {
      // Inter-state supply (Tamil Nadu to Rest of India): 18% IGST
      igst = taxAmount;
    }

    return {
      isInclusive: true,
      taxRateBps: rateBps,
      taxRatePercent: rateBps / 100,
      grossTotal: grossAmount,
      taxAmount,
      netSubtotal,
      isHomeState: isHome,
      destinationState: destinationState || TaxService.DEFAULT_HOME_STATE,
      cgst,
      sgst,
      igst,
      hsn: TaxService.DEFAULT_HSN,
    };
  }

  /**
   * Loads live GST and shipping thresholds from database AppSetting table
   */
  public static async getCommerceSettings() {
    const settings = await prisma.appSetting.findMany();
    const map = new Map(settings.map(s => [s.key, s.value]));

    return {
      gstEnabled: map.get('gst_enabled') !== 'false',
      gstRateBps: parseInt(map.get('gst_rate') || '1800', 10),
      gstInclusive: map.get('gst_inclusive') !== 'false',
      gstLegalName: map.get('gst_legal_name') || 'Chemical Brothers Perfumery LLP',
      gstin: map.get('gst_number') || '33AAWFC8794P1Z7',
      gstHomeState: map.get('gst_state') || 'Tamil Nadu',
      gstHsn: map.get('gst_hsn') || '33030050',
      freeShippingThreshold: parseInt(map.get('free_shipping_over') || '5000', 10),
      standardShippingFee: parseInt(map.get('shipping_fee') || '250', 10),
    };
  }
}
