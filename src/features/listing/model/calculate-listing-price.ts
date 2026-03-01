import { differenceInCalendarDays } from 'date-fns';

type PricePeriod = {
  dateFrom: Date;
  dateTo: Date;
  pricePerNight: number;
};

export function calculateListingPrice(input: { dateFrom: Date; dateTo: Date; pricePeriods: PricePeriod[] }) {
  const nights = differenceInCalendarDays(input.dateTo, input.dateFrom);
  if (nights <= 0) {
    return { ok: false, message: 'Некорректный диапазон дат' } as const;
  }

  let totalPrice = 0;

  for (let i = 0; i < nights; i += 1) {
    const dayStart = new Date(input.dateFrom);
    dayStart.setUTCDate(dayStart.getUTCDate() + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const period = input.pricePeriods.find((item) => item.dateFrom <= dayStart && item.dateTo >= dayEnd);
    if (!period) {
      return { ok: false, message: 'Нет цены на одну или несколько ночей в периоде' } as const;
    }

    totalPrice += period.pricePerNight;
  }

  return { ok: true, nights, totalPrice } as const;
}
