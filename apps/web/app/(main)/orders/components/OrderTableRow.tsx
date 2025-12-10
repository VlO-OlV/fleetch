import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { PaymentTypeToDetailsMap, RideStatusToDetailsMap } from '@/lib/consts';
import { formatName } from '@/lib/utils';
import { ClientResponse } from '@/types/client';
import { RideResponse } from '@/types/ride';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface OrderTableRowProps {
  ride: RideResponse;
}

export const OrderTableRow: FC<OrderTableRowProps> = ({ ride }) => {
  const router = useRouter();

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
      <TableCell>{RideStatusToDetailsMap[ride.status].label}</TableCell>
      <TableCell>{PaymentTypeToDetailsMap[ride.paymentType].label}</TableCell>
      <TableCell>${ride.totalPrice.toFixed(2)}</TableCell>
      <TableCell className="capitalize">{rideClass.name}</TableCell>
      <TableCell className="w-[150px]">
        <Button size="sm" onClick={() => router.push(`/orders/${ride.id}`)}>
          Profile
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/orders/${ride.id}/edit`)}
          className="ml-2"
        >
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
};
