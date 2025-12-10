import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useClient } from '@/hooks/use-client';
import { useDriver } from '@/hooks/use-driver';
import { formatName } from '@/lib/utils';
import { ClientResponse } from '@/types/client';
import { DriverResponse } from '@/types/driver';
import { format } from 'date-fns';
import { FC } from 'react';

interface ClientProfileDialogProps {
  client: ClientResponse | null;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

export const ClientProfileDialog: FC<ClientProfileDialogProps> = ({
  client,
  isOpen,
  onOpenChange,
}) => {
  const { deleteClient } = useClient({ id: isOpen ? client?.id : undefined });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Client profile</DialogTitle>
        {client && (
          <div className="mt-2">
            <p>
              <strong>ID:</strong> {client.id}
            </p>
            <p>
              <strong>Name:</strong>{' '}
              {formatName(client.firstName, client.middleName, client.lastName)}
            </p>
            <p>
              <strong>Phone number:</strong> {client.phoneNumber}
            </p>
            <p>
              <strong>Total rides:</strong> {client.totalRides || 0}
            </p>
            <p>
              <strong>Date of join:</strong>{' '}
              {format(new Date(client.createdAt), 'dd/MM/yyyy')}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              deleteClient(client?.id);
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
