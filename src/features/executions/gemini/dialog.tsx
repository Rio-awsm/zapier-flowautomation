"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export const AVAILABLE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash-8b",
  "gemini-2.5-pro",
  "gemini-2.0-pro",
  "gemini-pro",
] as const;

const formSchema = z.object({
  model: z.string().min(1, "Model is required."),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { message: "User Prompt is required" }),
  variableName: z.string().min(1, { message: "Variable name is required" }),
});

export type FormType = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultModel?: string;
  defaultSystemPrompt?: string;
  defaultUserPrompt?: string;
  defaultVariableName?: string;
}

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultModel = AVAILABLE_MODELS[0],
  defaultSystemPrompt = "",
  defaultUserPrompt = "",
  defaultVariableName = "",
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: defaultModel,
      systemPrompt: defaultSystemPrompt,
      userPrompt: defaultUserPrompt,
      variableName: defaultVariableName,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        model: defaultModel,
        systemPrompt: defaultSystemPrompt,
        userPrompt: defaultUserPrompt,
        variableName: defaultVariableName,
      });
    }
  }, [
    open,
    defaultModel,
    defaultSystemPrompt,
    defaultUserPrompt,
    defaultVariableName,
    form,
  ]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gemini</DialogTitle>
          <DialogDescription>
            Configure the settings for Gemini node.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABLE_MODELS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select which Gemini model to use.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="System instructions..."
                      {...field}
                      className="min-h-[80px] font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>Optional system-level instructions for the model.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the prompt for the model"
                      {...field}
                      className="min-h-[120px] font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. geminiResponse" {...field} />
                  </FormControl>
                  <FormDescription>This variable will reference the response from Gemini.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit" className="w-full">
                Save
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
