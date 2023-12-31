"use client";
import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/chat/index.mjs";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { codeSchema } from "./constants";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiCode } from "react-icons/bi";
import Heading from "@/components/page/heading";
import Form from "@/components/forms/form";
import Input from "@/components/forms/input";
import Button from "@/components/button";
import Loader from "@/components/page/loader";
import Empty from "@/components/page/empty";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import UserAvatar from "@/components/page/user-avatar";
import BotAvatar from "@/components/page/bot-avatar";
import { ProModalContext } from "@/context/pro-modal-provider";
import toast from "react-hot-toast";

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

  const { setOpen } = useContext(ProModalContext);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
  });

  const onSubmit = async (values: z.infer<typeof codeSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/code", {
        messages: newMessages,
      });

      setMessages((value) => [...value, userMessage, response.data]);

      reset();
    } catch (error: any) {
      toast.error("Something went wrong");
      if (error?.response?.status === 403) {
        setOpen();
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Code"
        icon={BiCode}
        description="Generate code using descriptive text"
        color="text-green-700"
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Simple modal using react context..."
          className="col-span-full lg:col-span-9"
          register={{ ...register("prompt") }}
          required
        />
        <Button
          className="col-span-full lg:col-span-3"
          color="bg-gradient-to-r from-green-700 to-cyan-500 text-white"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </Form>
      <div>
        {isSubmitting && <Loader />}
        {messages.length === 0 && !isSubmitting && (
          <Empty label="No code generated..." />
        )}
        <div className="flex flex-col-reverse gap-y-4 mt-8">
          {messages.map((message) => (
            <div
              key={message.content}
              className={`flex p-6 lg:p-8 gap-x-6 lg:gap-x-8 rounded-lg ${
                message.role === "user"
                  ? " border border-slate-200"
                  : "bg-slate-200/80"
              }`}
            >
              {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
              <ReactMarkdown
                components={{
                  pre: ({ node, ...props }) => (
                    <div className="overflow-auto w-full my-2 bg-slate-300 p-2 rounded-lg">
                      <pre {...props} />
                    </div>
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-slate-300 rounded-lg p-1" {...props} />
                  ),
                }}
                className="text-sm overflow-hidden leading-7"
              >
                {message.content || ""}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CodePage;
