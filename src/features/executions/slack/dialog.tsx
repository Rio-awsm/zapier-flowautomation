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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  variableName: z.string().min(1, { message: "Variable name is required" }),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(2000, "Slack messages cannot exceed 2000 characters"),
  webhookUrl: z.string().min(1, "Webhook url is required"),
});

export type FormType = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultVariableName?: string;
  defaultContent?: string;
  defaultWebhookUrl?: string;
}

export const SlackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultVariableName = "",
  defaultContent = "",
  defaultWebhookUrl = "",
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultVariableName,
      content: defaultContent,
      webhookUrl: defaultWebhookUrl,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultVariableName,
        content: defaultContent,
        webhookUrl: defaultWebhookUrl,
      });
    }
  }, [open, defaultVariableName, defaultContent, defaultWebhookUrl, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slack</DialogTitle>
          <DialogDescription>
            Configure the settings for Slack node.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://slack.com/api/webhooks/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Slack webhook URL for sending messages.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summary: {{myGemini.text}}"
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
                    <Input placeholder="e.g. slackResponse" {...field} />
                  </FormControl>
                  <FormDescription>
                    This variable will reference the response from Slack.
                  </FormDescription>
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
