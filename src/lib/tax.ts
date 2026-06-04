export interface TaxInfo {
  rate: number;
  label: string;
}

export function getTaxForProvince(province: string | null, country: string): TaxInfo {
  if (country === 'CA') {
    switch (province?.toUpperCase()) {
      case 'ON':
        return { rate: 0.13, label: 'HST (ON 13%)' };
      case 'QC':
        return { rate: 0.14975, label: 'GST+QST (QC 14.975%)' };
      case 'BC':
        return { rate: 0.12, label: 'GST+PST (BC 12%)' };
      case 'MB':
        return { rate: 0.12, label: 'GST+RST (MB 12%)' };
      case 'SK':
        return { rate: 0.11, label: 'GST+PST (SK 11%)' };
      case 'AB':
      case 'NT':
      case 'NU':
      case 'YT':
        return { rate: 0.05, label: 'GST (5%)' };
      case 'NB':
      case 'NL':
      case 'NS':
      case 'PE':
        return { rate: 0.15, label: 'HST (15%)' };
      default:
        return { rate: 0.13, label: 'HST (ON 13%)' }; // Default to Ontario HST if not specified
    }
  } else if (country === 'KE') {
    return { rate: 0.16, label: 'VAT (KE 16%)' };
  } else if (country === 'TZ' || country === 'UG' || country === 'RW') {
    return { rate: 0.18, label: 'VAT (18%)' };
  } else {
    return { rate: 0, label: 'No Tax (0%)' };
  }
}
