import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileInput } from '@/components/ui/file-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUser } from '@/hooks/use-user';
import { useI18n } from '@/lib/i18n';
import { ApiEndpoint, FileType } from '@/lib/consts';
import { getFileUrl } from '@/lib/utils';
import apiService from '@/services/api/api.service';
import { UpdateProfileDto, updateProfileSchema } from '@/validation/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { TrashIcon } from 'lucide-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

export const EditProfileDialog: FC<EditProfileDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const { user, updateMe } = useUser({});
  const { t } = useI18n();

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const defaultValues = useMemo(
    () => ({
      firstName: user?.firstName || '',
      middleName: user?.middleName || undefined,
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || undefined,
    }),
    [user],
  );

  const form = useForm<UpdateProfileDto>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { ...defaultValues },
  });

  useEffect(() => form.reset({ ...defaultValues }), [defaultValues]);

  const onSubmit = async (data: UpdateProfileDto) => {
    let profileImageId;
    if (data.profileImage) {
      const response = await apiService.upload(data.profileImage);
      profileImageId = response.data.id;
    }

    const { profileImage, ...updatedData } = data;
    updateMe(
      {
        ...updatedData,
        profileImageId:
          profileImageId || (data.profileImage === null ? null : undefined),
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  useEffect(() => {
    if (!isOpen) setPhotoPreview(null);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>{t('profile.edit.title', 'Edit profile')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="w-full flex justify-center">
            {(photoPreview || user?.profileImageId) &&
            form.watch('profileImage') !== null ? (
              <div className="relative">
                <img
                  src={
                    photoPreview || getFileUrl(user?.profileImageId as string)
                  }
                  alt="Image preview"
                  className="h-24 aspect-square rounded-full object-cover object-center"
                />
                <span
                  onClick={() =>
                    form.setValue('profileImage', null, { shouldDirty: true })
                  }
                  className="absolute bottom-1 right-1 h-5 aspect-square rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  <TrashIcon color="#ea1a24" size={12} />
                </span>
              </div>
            ) : (
              <div className="h-24 aspect-square rounded-full bg-gray-200" />
            )}
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.firstName', 'First name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.middleName', 'Middle name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.lastName', 'Last name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.phone', 'Phone')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('form.profilePicture', 'Profile picture')}
                  </FormLabel>
                  <FormControl>
                    <FileInput
                      fileType={FileType.IMAGE}
                      onChange={(file) =>
                        form.setValue('profileImage', file || undefined, {
                          shouldDirty: true,
                        })
                      }
                      onPreviewChange={(url) => setPhotoPreview(url)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  {t('action.cancel', 'Cancel')}
                </Button>
              </DialogClose>
              <Button type="submit">{t('action.save', 'Save')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
