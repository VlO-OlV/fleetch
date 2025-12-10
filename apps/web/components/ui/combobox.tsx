import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ComboboxProps {
  selected?: {
    value: string;
    label: string;
  };
  data: {
    value: string;
    label: string;
  }[];
  placeholder?: string;
  onChange: (value: string) => void;
  onSearchChange: (search: string) => void;
  triggerClassName?: HTMLAttributes<HTMLButtonElement>['className'];
}

export const Combobox: FC<ComboboxProps> = ({
  selected,
  placeholder = 'Search',
  data,
  onChange,
  onSearchChange,
  triggerClassName,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search.length]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('w-[200px] justify-between', triggerClassName)}
        >
          {selected?.label || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandGroup>
              {data.map(({ value, label }) => (
                <CommandItem
                  key={value}
                  value={label}
                  onSelect={() => {
                    onChange(value);
                    setIsOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {label}
                  <Check
                    className={cn(
                      'ml-auto',
                      selected?.value === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
