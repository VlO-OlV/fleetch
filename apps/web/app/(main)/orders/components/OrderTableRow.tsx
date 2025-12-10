import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { PaymentTypeToDetailsMap, RideStatusToDetailsMap } from '@/lib/consts';
import { formatName } from '@/lib/utils';
import { ClientResponse } from '@/types/client';
import { RideResponse } from '@/types/ride';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useI18n } from '@/lib/i18n';

interface OrderTableRowProps {
  ride: RideResponse;
}

export const OrderTableRow: FC<OrderTableRowProps> = ({ ride }) => {
  const router = useRouter();
  const { t } = useI18n();

  const { client, operator, driver, rideClass } = ride;

  return (
    <TableRow key={ride.id}>
      <TableCell>
        {client
          ? formatName(client.firstName, client.middleName, client.lastName)
          : '-'}
      </TableCell>
      <TableCell>
        {driver
          ? formatName(driver.firstName, driver.middleName, driver.lastName)
          : '-'}
      </TableCell>
      <TableCell>
        {operator
          ? formatName(
              operator.firstName,
              operator.middleName,
              operator.lastName,
            )
          : '-'}
      </TableCell>
      <TableCell>
        <span
          className={`flex items-center justify-self-start px-2 py-0.5 rounded-full text-sm font-medium border`}
          style={{
            color: RideStatusToDetailsMap[ride.status].color,
            borderColor: RideStatusToDetailsMap[ride.status].color,
            backgroundColor: RideStatusToDetailsMap[ride.status].bgColor,
          }}
        >
          {t(RideStatusToDetailsMap[ride.status].label, ride.status)}
        </span>
      </TableCell>
      <TableCell>
        <span
          className={`flex items-center justify-self-start px-2 py-0.5 rounded-full text-sm font-medium border`}
          style={{
            color: PaymentTypeToDetailsMap[ride.paymentType].color,
            borderColor: PaymentTypeToDetailsMap[ride.paymentType].color,
            backgroundColor: PaymentTypeToDetailsMap[ride.paymentType].bgColor,
          }}
        >
          {t(PaymentTypeToDetailsMap[ride.paymentType].label, ride.paymentType)}
        </span>
      </TableCell>
      <TableCell>${ride.totalPrice.toFixed(2)}</TableCell>
      <TableCell className="capitalize">{rideClass.name}</TableCell>
      <TableCell className="w-[150px]">
        <Button size="sm" onClick={() => router.push(`/orders/${ride.id}`)}>
          {t('button.profile', 'Profile')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/orders/${ride.id}/edit`)}
          className="ml-2"
        >
          {t('button.edit', 'Edit')}
        </Button>
      </TableCell>
    </TableRow>
  );
};
