import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { UserStateToDetailsMap } from '@/lib/consts';
import { formatName } from '@/lib/utils';
import { UserResponse } from '@/types/user';
import { FC, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';

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
  const { t } = useI18n();
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
      <TableCell className="w-[150px]">
        <span
          className={`flex items-center justify-self-start px-2 py-0.5 rounded-full text-sm font-medium border`}
          style={{
            color: operatorStateDetails.color,
            borderColor: operatorStateDetails.color,
            backgroundColor: operatorStateDetails.bgColor,
          }}
        >
          {t(operatorStateDetails.label, operator.state)}
        </span>
      </TableCell>
      <TableCell className="w-[200px]">
        <Button size="sm" onClick={() => onOpenProfile(operator)}>
          {t('button.view', 'View')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(operator)}
          className="ml-2"
        >
          {t('button.edit', 'Edit')}
        </Button>
      </TableCell>
    </TableRow>
  );
};
