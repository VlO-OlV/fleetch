import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDriver } from '@/hooks/use-driver';
import { useUser } from '@/hooks/use-user';
import { formatName } from '@/lib/utils';
import { DriverResponse } from '@/types/driver';
import { UserResponse } from '@/types/user';
import { FC } from 'react';

interface OperatorProfileDialogProps {
  operator: UserResponse | null;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

export const OperatorProfileDialog: FC<OperatorProfileDialogProps> = ({
  operator,
  isOpen,
  onOpenChange,
}) => {
  const { deleteOperator } = useUser({ id: operator?.id });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Operator profile</DialogTitle>
        {operator && (
          <div className="mt-2">
            <p>
              <strong>ID:</strong> {operator.id}
            </p>
            <p>
              <strong>Name:</strong>{' '}
              {formatName(
                operator.firstName,
                operator?.middleName,
                operator.lastName,
              )}
            </p>
            <p>
              <strong>Email:</strong> {operator.email}
            </p>
            <p>
              <strong>Phone:</strong> {operator.phoneNumber}
            </p>
            <p>
              <strong>State:</strong> {operator.state}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              deleteOperator(operator?.id);
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
