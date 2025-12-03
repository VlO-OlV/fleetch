'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const extraOptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

const rideClassSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  priceCoefficient: z.coerce.number().min(0.1, 'Must be at least 0.1'),
});

type ExtraOption = { id: string; name: string };
type RideClass = { id: string; name: string; priceCoefficient: number };

export default function SettingsPage() {
  const [extras, setExtras] = useState<ExtraOption[]>([]);
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);
  const [classes, setClasses] = useState<RideClass[]>([]);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  // Form for extra option
  const extraForm = useForm({
    resolver: zodResolver(extraOptionSchema),
    defaultValues: { name: '' },
  });

  // Form for ride class
  const classForm = useForm({
    resolver: zodResolver(rideClassSchema),
    defaultValues: { name: '', priceCoefficient: 1 },
  });

  function addExtra(data: { name: string }) {
    const item: ExtraOption = {
      id: String(Date.now()),
      name: data.name.trim(),
    };
    setExtras((s) => [item, ...s]);
    extraForm.reset();
  }

  function saveEditedExtra(data: { name: string }) {
    if (!editingExtraId) return;
    setExtras((s) =>
      s.map((it) =>
        it.id === editingExtraId ? { ...it, name: data.name } : it,
      ),
    );
    setEditingExtraId(null);
    extraForm.reset();
  }

  function deleteExtra(id: string) {
    if (!confirm('Delete this extra option?')) return;
    setExtras((s) => s.filter((it) => it.id !== id));
  }

  function startEditExtra(item: ExtraOption) {
    setEditingExtraId(item.id);
    extraForm.setValue('name', item.name);
  }

  function addClass(data: { name: string; priceCoefficient: number }) {
    const item: RideClass = {
      id: String(Date.now()),
      name: data.name.trim(),
      priceCoefficient: data.priceCoefficient,
    };
    setClasses((s) => [item, ...s]);
    classForm.reset();
  }

  function saveEditedClass(data: { name: string; priceCoefficient: number }) {
    if (!editingClassId) return;
    setClasses((s) =>
      s.map((it) =>
        it.id === editingClassId
          ? { ...it, name: data.name, priceCoefficient: data.priceCoefficient }
          : it,
      ),
    );
    setEditingClassId(null);
    classForm.reset();
  }

  function startEditClass(item: RideClass) {
    setEditingClassId(item.id);
    classForm.setValue('name', item.name);
    classForm.setValue('priceCoefficient', item.priceCoefficient);
  }

  function deleteClass(id: string) {
    if (!confirm('Delete this ride class?')) return;
    setClasses((s) => s.filter((it) => it.id !== id));
  }

  return (
    <div className="w-full">
      <main>
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-md bg-white p-4 shadow">
            <h2 className="mb-3 text-lg font-medium">Ride Extra Options</h2>

            <Form {...extraForm}>
              <form
                onSubmit={extraForm.handleSubmit(
                  editingExtraId ? saveEditedExtra : addExtra,
                )}
                className="mb-4 flex items-end gap-2"
              >
                <FormField
                  control={extraForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Extra option name" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {editingExtraId ? (
                  <>
                    <Button type="submit" className="h-9">
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      className="h-9"
                      onClick={() => {
                        setEditingExtraId(null);
                        extraForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button type="submit" className="h-9">
                    Add
                  </Button>
                )}
              </form>
            </Form>

            <div className="space-y-2">
              {extras.length === 0 ? (
                <li className="text-sm text-muted-foreground">
                  No extra options yet.
                </li>
              ) : null}
              {extras.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div>{it.name}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditExtra(it)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600"
                      onClick={() => deleteExtra(it.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </div>
          </section>

          <section className="rounded-md bg-white p-4 shadow">
            <h2 className="mb-3 text-lg font-medium">Ride Classes</h2>

            <Form {...classForm}>
              <form
                onSubmit={classForm.handleSubmit(
                  editingClassId ? saveEditedClass : addClass,
                )}
                className="mb-4 grid grid-cols-2 gap-2"
              >
                <FormField
                  control={classForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Class name" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={classForm.control}
                  name="priceCoefficient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price coefficient</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder="Price coefficient"
                          value={
                            typeof field.value === 'number'
                              ? field.value
                              : Number(field.value) || ''
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="col-span-2 flex gap-2">
                  {editingClassId ? (
                    <>
                      <Button type="submit" className="flex-1">
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        className="flex-1"
                        onClick={() => {
                          setEditingClassId(null);
                          classForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button type="submit" className="w-full">
                      Add class
                    </Button>
                  )}
                </div>
              </form>
            </Form>

            <div className="space-y-2">
              {classes.length === 0 ? (
                <li className="text-sm text-muted-foreground">
                  No ride classes yet.
                </li>
              ) : null}
              {classes.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Coefficient: {it.priceCoefficient}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditClass(it)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600"
                      onClick={() => deleteClass(it.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
