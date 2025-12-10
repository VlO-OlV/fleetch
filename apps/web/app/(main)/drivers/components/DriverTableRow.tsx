import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { useRideClass } from '@/hooks/use-ride-class';
import { DriverStatusToDetailsMap } from '@/lib/consts';
import { formatName } from '@/lib/utils';
import { DriverResponse } from '@/types/driver';
import { FC, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useUser } from '@/hooks/use-user';
import { UserRole } from '@/types/user';

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
  const { t } = useI18n();
  const { user } = useUser({});
  const driverStatusDetails = useMemo(
    () => DriverStatusToDetailsMap[driver.status],
    [driver.status],
  );

  return (
    <TableRow key={driver.id}>
      <TableCell>
        {formatName(driver.firstName, driver.middleName, driver.lastName)}
      </TableCell>
      <TableCell>{driver.phoneNumber || '-'}</TableCell>
      <TableCell className="capitalize">{driver.rideClass.name}</TableCell>
      <TableCell>
        <span
          className={`flex items-center justify-self-start px-2 py-0.5 rounded-full text-sm font-medium border`}
          style={{
            color: driverStatusDetails.color,
            borderColor: driverStatusDetails.color,
            backgroundColor: driverStatusDetails.bgColor,
          }}
        >
          {t(driverStatusDetails.label, driver.status)}
        </span>
      </TableCell>
      <TableCell>{driver.totalRides}</TableCell>
      <TableCell>{driver.carNumber}</TableCell>
      <TableCell className="w-[150px]">
        <Button size="sm" onClick={() => onOpenProfile(driver)}>
          {t('button.profile', 'Profile')}
        </Button>
        {user?.role === UserRole.ADMIN && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(driver)}
            className="ml-2"
          >
            {t('button.edit', 'Edit')}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
