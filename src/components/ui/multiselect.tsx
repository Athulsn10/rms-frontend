import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
  WandSparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const multiSelectVariants = cva(
  "m-1 md:h-6 h-4",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
        rmscolor: "border-transparent bg-orange-200 hover:bg-orange-100 text-orange-900"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  allowCustomItems?: boolean; // New prop to control custom item addition
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      allowCustomItems = true, // Default to true to allow custom items
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(""); // New state for input tracking
    const [customOptions, setCustomOptions] = React.useState<typeof options>([]); // New state for custom options

    const allOptions = React.useMemo(
      () => [...options, ...customOptions],
      [options, customOptions]
    );

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter" && inputValue.trim() && allowCustomItems) {
        event.preventDefault();

        // Check if the input matches any existing option
        const existingOption = allOptions.find(
          (opt) => opt.label.toLowerCase() === inputValue.trim().toLowerCase()
        );

        if (!existingOption) {
          // Create new option
          const newOption = {
            label: inputValue.trim(),
            value: `custom-${inputValue.trim().toLowerCase().replace(/\s+/g, '-')}`,
          };

          setCustomOptions((prev) => [...prev, newOption]);
          setSelectedValues((prev) => [...prev, newOption.value]);
          onValueChange([...selectedValues, newOption.value]);
          setInputValue("");
        } else {
          // Select existing option if not already selected
          if (!selectedValues.includes(existingOption.value)) {
            setSelectedValues((prev) => [...prev, existingOption.value]);
            onValueChange([...selectedValues, existingOption.value]);
          }
        }
      } else if (event.key === "Backspace" && !inputValue) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
      setCustomOptions([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <div className="flex justify-between items-center w-full h-5">
          <div className="flex flex-wrap items-center md:max-h-none max-h-5">
            {selectedValues.slice(0, maxCount).map((value) => {
              const option = allOptions.find((o) => o.value === value);
              return (
                <Badge
                  key={value}
                  className={cn(
                    isAnimating ? "animate-bounce" : "",
                    multiSelectVariants({ variant })
                  )}
                  style={{ animationDuration: `${animation}s` }}
                >
                  {option?.label}
                  <XCircle
                    className="ml-2 md:h-4 md:w-4 h-3 w-3 cursor-pointer"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleOption(value);
                    }}
                  />
                </Badge>
              );
            })}
            {selectedValues.length > maxCount && (
              <Badge
                className={cn(
                  "bg-transparent text-foreground border-foreground/1 hover:bg-transparent m-0",
                  isAnimating ? "animate-bounce" : "",
                  multiSelectVariants({ variant })
                )}
                style={{ animationDuration: `${animation}s` }}
              >
                {`+ ${selectedValues.length - maxCount} more`}
                <XCircle
                  className="ml-2 h-4 w-4 cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation();
                    clearExtraOptions();
                  }}
                />
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between">
            {selectedValues.length > 0 && (
              <XIcon
                className="h-4 mx-2 cursor-pointer text-muted-foreground"
                onClick={(event) => {
                  event.stopPropagation();
                  handleClear();
                }}
              />
            )}
          </div>
        </div>

        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto",
              className
            )}
          >
            <div className="flex items-center justify-between w-full mx-auto">
              <span className="text-sm text-muted-foreground mx-3">
                {placeholder}
              </span>
              <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandInput
              placeholder={allowCustomItems ? "Search or enter new item..." : "Search..."}
              onKeyDown={handleInputKeyDown}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList className="w-96">
              <CommandEmpty>
                {allowCustomItems
                  ? "Press Enter to add as new item"
                  : "No results found."}
              </CommandEmpty>
              <CommandGroup >
                {allOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
            </CommandList>
          </Command>
        </PopoverContent>
        <div className="h-6 flex items-center">
          {animation > 0 && selectedValues.length > 0 && (
            <WandSparkles
              className={cn(
                "cursor-pointer text-foreground bg-background w-3 h-3",
                isAnimating ? "" : "text-muted-foreground"
              )}
              onClick={() => setIsAnimating(!isAnimating)}
            />
          )}
        </div>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";