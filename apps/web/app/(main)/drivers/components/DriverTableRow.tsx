import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { DriverStatusToDetailsMap } from '@/lib/consts';
import { formatName } from '@/lib/utils';
import { DriverResponse } from '@/types/driver';
import { FC, useMemo } from 'react';

interface DriverTableRowProps {
  driver: DriverResponse;
  onOpenProfile: (driver: DriverResponse) => void;
  onEdit: (driver: DriverResponse) => void;
}

export const DriverTableRow: FC<DriverTableRowProps> = ({
  driver,
  onOpenProfile,
  onEdit,
}) => {
  const driverStatusDetails = useMemo(
    () => DriverStatusToDetailsMap[driver.status],
    [driver.status],
  );

  return (
    <TableRow key={driver.id}>
      <TableCell>
        {formatName(driver.firstName, driver.middleName, driver.lastName)}
      </TableCell>
      <TableCell>{driver.phoneNumber}</TableCell>
      <TableCell className="capitalize">{driver.rideClassId}</TableCell>
      <TableCell>
        <span
          className={`flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-[${driverStatusDetails.bgColor}] color-[${driverStatusDetails.color}] border-[${driverStatusDetails.color}]`}
        >
          {driverStatusDetails.label}
        </span>
      </TableCell>
      <TableCell>{driver.totalRides}</TableCell>
      <TableCell>{driver.carNumber}</TableCell>
      <TableCell className="w-[150px]">
        <Button size="sm" onClick={() => onOpenProfile(driver)}>
          Profile
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(driver)}
          className="ml-2"
        >
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
};
