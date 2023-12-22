"use client";
import { UploadInput, UploadRoot, useUpload } from "@cyhfe/react-ui";
import { useEditor } from ".";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
function Panel() {
  return (
    <div className="w-[300px]">
      <UploadRoot name="files">
        <ImageList />
      </UploadRoot>
    </div>
  );
}

function ImageList() {
  const { getFileList, removeFile } = useUpload("FileList");
  const { imageList, setImageList } = useEditor();
  const fileList = getFileList();
  return (
    <div className="flex gap-2 flex-wrap">
      {fileList.map((file) => (
        <div
          className="border  rounded w-28 h-28 flex items-center justify-center"
          key={file.uid}
        >
          <Image
            width={200}
            height={200}
            className="object-scale-down w-28 h-28"
            src={URL.createObjectURL(file.file)}
            alt={file.file.name}
            onClick={() => {
              setImageList((prev) => {
                const next = { file: file.file, id: uuidv4() };
                return [...prev, next];
              });
            }}
          />
        </div>
      ))}
      <UploadInput multiple accept="image/*">
        <div className="border  rounded border-dashed w-28 h-28 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div>upload</div>
          </div>
        </div>
      </UploadInput>
    </div>
  );
}

export { Panel };
