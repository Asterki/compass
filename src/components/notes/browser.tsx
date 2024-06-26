import * as React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faChevronCircleDown, faNoteSticky } from "@fortawesome/free-solid-svg-icons";

import * as Collapsible from "@radix-ui/react-collapsible";

import { NextPage } from "next";

interface NotesFolder {
    type: "folder" | "note";
    name: string;
    link: string | null;
    children?: NotesFolder[];
}

interface NotesBrowserProps {
    notes: NotesFolder;
}

const NotesBrowserComponent: NextPage<NotesBrowserProps> = (props) => {
    const mapFolder = (folder: NotesFolder) => {
        if (folder.type === "folder") {
            return (
                <Collapsible.Root className="group mt-2 w-full">
                    <Collapsible.Trigger className="group mt-2 flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2">
                        <div>
                            <FontAwesomeIcon icon={faFolder} className="mr-2 fill-white" />
                            {folder.name}
                        </div>
                        <FontAwesomeIcon
                            icon={faChevronCircleDown}
                            className="fill-white transition-all group-data-[state=open]:rotate-180"
                        />
                    </Collapsible.Trigger>
                    <Collapsible.Content className="flex items-stretch">
                        <div className="w-full -mt-2 border-l-2 border-slate-800 p-2">
                            {folder.children?.map((child) => {
                                if (child.type === "folder") {
                                    return mapFolder(child);
                                } else {
                                    return (
                                        <div key={`${folder.name}-${folder.name}`} className="group mt-2 flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2">
                                            <div>
                                                <FontAwesomeIcon icon={faNoteSticky} className="mr-2 fill-white" />
                                                {child.name}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </Collapsible.Content>
                </Collapsible.Root>
            );
        } else if (folder.type === "note") {
            return (
                <div className="group mt-2 flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2">
                    <div>
                        <FontAwesomeIcon icon={faNoteSticky} className="mr-2 fill-white" />
                        {folder.name}
                    </div>
                </div>
            );
        }
    };

    return (
        <Collapsible.Root className="group mt-2 w-full">
            <Collapsible.Trigger className="group mt-2 flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2">
                <div>
                    <FontAwesomeIcon icon={faFolder} className="mr-2 fill-white" />
                    {props.notes.name}
                </div>
                <FontAwesomeIcon
                    icon={faChevronCircleDown}
                    className="fill-white transition-all group-data-[state=open]:rotate-180"
                />
            </Collapsible.Trigger>
            <Collapsible.Content className="flex items-stretch">
                <div className="w-full -mt-2 border-l-2 border-slate-800 p-2">
                    {props.notes.children?.map((child) => {
                        return mapFolder(child);
                    })}
                </div>
            </Collapsible.Content>
        </Collapsible.Root>
    );
};

export default NotesBrowserComponent;
