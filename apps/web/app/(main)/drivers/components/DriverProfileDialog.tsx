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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Driver profile</DialogTitle>
        {driver && (
          <div className="mt-2">
            <p>
              <strong>ID:</strong> {driver.id}
            </p>
            <p>
              <strong>Name:</strong>{' '}
              {formatName(driver.firstName, driver.middleName, driver.lastName)}
            </p>
            <p>
              <strong>Phone:</strong> {driver.phoneNumber || '-'}
            </p>
            <p>
              <strong>Ride Class:</strong> {driver.rideClass.name}
            </p>
            <p>
              <strong>Car #:</strong> {driver.carNumber}
            </p>
            <p>
              <strong>Total rides:</strong> {driver.totalRides}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              deleteDriver(driver?.id);
            }}
          >
            Delete
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
