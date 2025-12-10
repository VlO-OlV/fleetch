import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDriver } from '@/hooks/use-driver';
import { formatName } from '@/lib/utils';
import { DriverResponse } from '@/types/driver';
import { FC } from 'react';
import { useI18n } from '@/lib/i18n';
import { useUser } from '@/hooks/use-user';
import { UserRole } from '@/types/user';

interface DriverProfileDialogProps {
  driver: DriverResponse | null;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

export const DriverProfileDialog: FC<DriverProfileDialogProps> = ({
  driver,
  isOpen,
  onOpenChange,
}) => {
  const { deleteDriver } = useDriver({ id: driver?.id });
  const { t } = useI18n();
  const { user } = useUser({});

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{t('dialog.driverProfile', 'Driver profile')}</DialogTitle>
        {driver && (
          <div className="mt-2">
            <p>
              <strong>{t('table.id', 'ID')}:</strong> {driver.id}
            </p>
            <p>
              <strong>{t('profile.name', 'Name')}:</strong>{' '}
              {formatName(driver.firstName, driver.middleName, driver.lastName)}
            </p>
            <p>
              <strong>{t('profile.phone', 'Phone')}:</strong>{' '}
              {driver.phoneNumber || '-'}
            </p>
            <p>
              <strong>{t('profile.rideClass', 'Ride Class')}:</strong>{' '}
              {driver.rideClass.name}
            </p>
            <p>
              <strong>{t('profile.carNumber', 'Car #')}:</strong>{' '}
              {driver.carNumber}
            </p>
            <p>
              <strong>{t('profile.totalRides', 'Total rides')}:</strong>{' '}
              {driver.totalRides}
            </p>
          </div>
        )}
        <DialogFooter>
          {user?.role === UserRole.ADMIN && (
            <Button
              variant="destructive"
              onClick={() => {
                onOpenChange(false);
                deleteDriver(driver?.id);
              }}
            >
              {t('button.delete', 'Delete')}
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>
            {t('button.close', 'Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
