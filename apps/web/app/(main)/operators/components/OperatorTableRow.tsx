import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { UserStateToDetailsMap } from '@/lib/consts';
import { formatName } from '@/lib/utils';
import { UserResponse } from '@/types/user';
import { FC, useMemo } from 'react';

interface OperatorTableRowProps {
  operator: UserResponse;
  onOpenProfile: (operator: UserResponse) => void;
  onEdit: (operator: UserResponse) => void;
}

export const OperatorTableRow: FC<OperatorTableRowProps> = ({
  operator,
  onOpenProfile,
  onEdit,
}) => {
  const operatorStateDetails = useMemo(
    () => UserStateToDetailsMap[operator.state],
    [operator.state],
  );

  return (
    <TableRow key={operator.id}>
      <TableCell>
        {formatName(operator.firstName, operator.middleName, operator.lastName)}
      </TableCell>
      <TableCell>{operator.email}</TableCell>
      <TableCell>{operator.phoneNumber || '-'}</TableCell>
      <TableCell className="w-[150px] capitalize">
        {operatorStateDetails.label}
      </TableCell>
      <TableCell className="w-[200px]">
        <Button size="sm" onClick={() => onOpenProfile(operator)}>
          View
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(operator)}
          className="ml-2"
        >
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
};
