"use client";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { videoSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import Heading from "@/components/page/heading";
import { BiCameraMovie } from "react-icons/bi";
import Form from "@/components/forms/form";
import Input from "@/components/forms/input";
import Button from "@/components/button";
import Loader from "@/components/page/loader";
import Empty from "@/components/page/empty";
import axios from "axios";
import { ProModalContext } from "@/context/pro-modal-provider";
import toast from "react-hot-toast";

const VideoPage = () => {
  const router = useRouter();
  const [video, setVideo] = useState<string>();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof videoSchema>>({
    resolver: zodResolver(videoSchema),
  });

  const { setOpen } = useContext(ProModalContext);

  const onSubmit = async (value: z.infer<typeof videoSchema>) => {
    try {
      setVideo(undefined);

      const response = await axios.post("/api/video", value);

      setVideo(response.data[0]);
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
        title="Video"
        description="Turn your prompt into video"
        icon={BiCameraMovie}
        color="text-orange-700"
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          className="col-span-full lg:col-span-9"
          placeholder="Birds flying in the sky..."
          register={{ ...register("prompt") }}
        />
        <Button
          disabled={true}
          hover={false}
          color="bg-red-600 text-white"
          className="col-span-full lg:col-span-3"
          // color="bg-gradient-to-r from-orange-700 to-cyan-500 text-white"
        >
          Disabled, api down!
        </Button>
      </Form>
      <div>
        {isSubmitting && <Loader />}
        {!video && !isSubmitting && <Empty label="no video generated..." />}
        {video && (
          <video
            controls
            className="w-full mx-auto max-w-3xl aspect-video mt-8 rounded-lg border bg-black"
          >
            <source src={video}></source>
          </video>
        )}
      </div>
    </div>
  );
};
export default VideoPage;
