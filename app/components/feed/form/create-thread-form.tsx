"use client";

import { useState, useEffect } from "react";
import { CREATE_THREAD } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import CreateThreadButton from "./create-thread-button";
import EmojiPickerComponent from "./emoji-picker";
import GIFPickerComponent from "./gif-picker";
import { IoClose } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import Image from "next/image";
import { useSession } from "next-auth/react";
import NotSignedInMessage from "../../not-signed-in";

export default function CreatePostForm({ refetchThreads }: { refetchThreads: any }) {
    const [threadContent, setThreadContent] = useState<string>("");
    const [selectedGIF, setSelectedGIF] = useState<string>("");

    const [createThread, { loading }] = useMutation(CREATE_THREAD);
    const { data: session } = useSession();

    const handleThreadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (!session) return;

            await createThread({
                variables: {
                    content: threadContent,
                    gif: selectedGIF,
                    authorId: session?.user?.id,
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error has occured while trying to create new thread: ${error.message}`);
            } else {
                throw new Error("Unknown error while trying to create thread.");
            }
        } finally {
            refetchThreads();
            setThreadContent("");
            setSelectedGIF("");
        }
    };
    return (
        <>
            <div className="border-b border-x border-neutral-700 pt-4 pb-3 px-3">
                <div className="flex gap-4">
                    <div className="h-max">
                        <div className="h-[45px] w-[45px] flex items-center justify-center relative rounded-full ">{session?.user?.image ? <Image className="rounded-full" src={session?.user?.image as string} layout="fill" objectFit="contain" alt="profile picture" /> : <FiUser size={35} />}</div>
                    </div>
                    <form className="w-full" onSubmit={handleThreadSubmit}>
                        <div>
                            <textarea className="text-xl placeholder-neutral-500 focus:outline-none w-full resize-none break-all" placeholder="What's happening?" value={threadContent} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setThreadContent(e.target.value)} />
                        </div>
                        {selectedGIF && (
                            <div className="h-[250px] rounded-xl  relative border border-neutral-500 mb-5">
                                <button className="absolute z-40 right-4 top-2 bg-neutral-900 rounded-full" onClick={() => setSelectedGIF("")}>
                                    <IoClose size={24} />
                                </button>
                                <Image src={selectedGIF} className="rounded-xl" layout="fill" objectFit="center" objectPosition="center" alt="Selected GIF" />
                            </div>
                        )}

                        <hr className="border-neutral-700 mb-3" />
                        <div className="flex items-center gap-2">
                            <EmojiPickerComponent onThreadContentChange={setThreadContent} />
                            <GIFPickerComponent onGIFSelect={setSelectedGIF} />
                            <CreateThreadButton threadContent={threadContent} formSubmitState={loading} text={"Post"} />
                        </div>
                    </form>
                </div>
            </div>
            {!session && <NotSignedInMessage />}
        </>
    );
}
