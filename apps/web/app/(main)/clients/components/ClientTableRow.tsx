import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatName } from '@/lib/utils';
import { ClientResponse } from '@/types/client';
import { format } from 'date-fns';
import { FC } from 'react';
import { useI18n } from '@/lib/i18n';

interface ClientTableRowProps {
  client: ClientResponse;
  onOpenProfile: (client: ClientResponse) => void;
  onEdit: (client: ClientResponse) => void;
}

export const ClientTableRow: FC<ClientTableRowProps> = ({
  client,
  onOpenProfile,
  onEdit,
}) => {
  const { t } = useI18n();

  return (
    <TableRow key={client.id}>
      <TableCell>
        {formatName(client.firstName, client.middleName, client.lastName)}
      </TableCell>
      <TableCell>{client.phoneNumber || '-'}</TableCell>
      <TableCell>{format(new Date(client.createdAt), 'dd/MM/yyyy')}</TableCell>
      <TableCell className="w-[150px]">{client.totalRides}</TableCell>
      <TableCell className="w-[150px]">
        <Button size="sm" onClick={() => onOpenProfile(client)}>
          {t('button.profile', 'Profile')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(client)}
          className="ml-2"
        >
          {t('button.edit', 'Edit')}
        </Button>
      </TableCell>
    </TableRow>
  );
};
