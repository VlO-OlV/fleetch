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
import { useI18n } from '@/lib/i18n';

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
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          {t('dialog.operatorProfile', 'Operator profile')}
        </DialogTitle>
        {operator && (
          <div className="mt-2">
            <p>
              <strong>{t('table.id', 'ID')}:</strong> {operator.id}
            </p>
            <p>
              <strong>{t('profile.name', 'Name')}:</strong>{' '}
              {formatName(
                operator.firstName,
                operator?.middleName,
                operator.lastName,
              )}
            </p>
            <p>
              <strong>{t('profile.email', 'Email')}:</strong> {operator.email}
            </p>
            <p>
              <strong>{t('profile.phone', 'Phone')}:</strong>{' '}
              {operator.phoneNumber}
            </p>
            <p>
              <strong>{t('profile.state', 'State')}:</strong> {operator.state}
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
            {t('button.delete', 'Delete')}
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            {t('button.close', 'Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
