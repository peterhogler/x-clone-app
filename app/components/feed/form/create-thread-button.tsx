"use client";

export default function CreateThreadButton({ threadContent, formSubmitState }: { threadContent: string; formSubmitState: boolean }) {
    return (
        <button type="submit" className="font-bold ml-auto bg-sky-500 rounded-full px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed" disabled={!threadContent}>
            {formSubmitState ? "Creating.." : "Post"}
        </button>
    );
}
